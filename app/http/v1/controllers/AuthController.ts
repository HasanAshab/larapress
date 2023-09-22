import Controller from "~/core/decorators/controller";
import { inject } from "~/core/decorators/meta-data";
import { Request, Response } from "express";
import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";
import { log } from "helpers";
import config from "config"
import User from "~/app/models/User";
import URL from "URL";
import Cache from "Cache";
import Mail from "Mail";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";
import { OAuth2Client } from 'google-auth-library';
import { Mutex } from 'async-mutex';

@Controller
export default class AuthController {
  async register(req: Request, res: Response){
    const { email, username, password } = req.body;
    const logo = req.files?.logo;
    const userExists = await User.exists({
      $or: [ { email }, { username } ] 
    });
    if (userExists)
      return res.status(400).message("username or email already exist!");

    const user = new User({ email, username });
    await user.setPassword(password);
    logo && await user.attach("logo", logo as any);
    await user.save();
    const token = user.createToken();
    req.app.emit("Registered", user);
    res.status(201).api({
      token,
      message: "Verification email sent!",
    });
  };

  async login(req: Request, res: Response, @inject twoFactorAuthService: TwoFactorAuthService){
    const { email, password, otp } = req.body;
    const attemptCacheKey = "LOGIN-FAILED-ATTEMPTS_" + email;
    const mutex = new Mutex();
    await mutex.acquire();
    let failedAttemptsCount = await Cache.get(attemptCacheKey) ?? 0;
    mutex.release();
    if(typeof failedAttemptsCount === "string")
      failedAttemptsCount = parseInt(failedAttemptsCount);
    if(failedAttemptsCount > 3)
      return res.status(429).message("Too Many Failed Attempts  again later!");
    const user = await User.findOne({ email, password: { $ne: null }});
    if(user && user.password) {
      if (await user.attempt(password)) {
        const { twoFactorAuth } = await user.settings;
        if(twoFactorAuth.enabled){
          if(!otp) {
            return res.api({
              twoFactorAuthRequired: true,
              message: "Credentials matched. otp required!"
            });
          }
          const isValid = await twoFactorAuthService.verifyOtp(user, twoFactorAuth.method, parseInt(otp));
          if (!isValid)
            return res.status(401).message("Invalid OTP. Please  again!");
        }
        await Cache.clear(attemptCacheKey);
        return res.api({
          token: user.createToken(),
          message: "Logged in successfully!",
        });
      }
      await mutex.acquire();
      await Cache.put(attemptCacheKey, String(failedAttemptsCount + 1), 60 * 60);
      mutex.release();
    }
    res.status(401).message("Credentials not match!");
  }
  
  async loginWithRecoveryCode(req: Request, res: Response) {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if(!user)
      return res.status(404).message();
        
    return await user.verifyRecoveryCode(code)
      ? res.api({
          token: user.createToken(),
          message: "Logged in successfully!",
        })
      : res.status(401).message("Invalid recovery code!");
  }
  
  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { clientId, clientSecret, redirectUrl } = config.get<any>("socialite.google");
      const client = new OAuth2Client(clientId, clientSecret);
      
      const { tokens } = await client.getToken({ 
        code: req.query.code as string,
        redirect_uri: redirectUrl 
      })!;
      
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: clientId,
      });
      const { email, picture } = ticket.getPayload()!;
      const user = await User.findOneAndUpdate(
        { email },
        { "logo.url": picture, verified: true },
        { upsert: true, new: true }
      );
      const frontendClientUrl = user.username
        ? URL.client("oauth/success?token=" + user.createToken())
        : URL.client("oauth/set-username?token=" + user.createToken());
      res.redirect(frontendClientUrl);
    }
    catch (err: any) {
      log(err);
      res.redirect(URL.client("oauth/error"));
    }
  }
  
  async redirectToGoogle(req: Request, res: Response) {
    try {
      const { clientId, clientSecret, redirectUrl } = config.get<any>("socialite.google");
      const client = new OAuth2Client(clientId, clientSecret);
      const authUrl = client.generateAuthUrl({
        scope: ['profile', 'email'],
        redirect_uri: redirectUrl
      });
      res.redirect(authUrl);
    }
    catch (err: any) {
      log(err);
      res.redirect(URL.client("oauth/error"));
    }
  }
  
  async verifyEmail(req: Request, res: Response){
    await User.updateOne({ _id: req.params.id }, { verified: true });
    res.message("Email verified!");
  };

  async resendEmailVerification(req: Request, res: Response){
    User.findOne(req.body).then(user => {
      user && user.sendVerificationEmail().catch(log);
    }).catch(log);
    res.message("Verification email sent!");
  };

  async sendResetPasswordEmail(req: Request, res: Response){
    User.findOne(req.body).then(user => {
      user && user.sendResetPasswordEmail().catch(log);
    }).catch(log);
    res.message("Password reset email sent!");
  };

  async resetPassword(req: Request, res: Response){
    const { id, password, token } = req.body;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).message();

    return await user.resetPassword(token, password)
      ? res.message("Password changed successfully!")
      : res.status(401).message("Invalid or expired token!");
  };

  async changePassword(req: Request, res: Response){
    const user = req.user;
    if(!user.password)
      return res.status(400).message("This feature is not supported for OAuth account!");
    const { oldPassword, password } = req.body;
    if (!await user.attempt(oldPassword))
      return res.status(401).message("Incorrect password!");
    await user.setPassword(password);
    user.tokenVersion++;
    await user.save();
    Mail.to(user.email).send(new PasswordChangedMail()).catch(log);
    res.message("Password changed!");
  };
  
  async changePhoneNumber(req: Request, res: Response, @inject twoFactorAuthService: TwoFactorAuthService) {
    const { phoneNumber, otp } = req.body;
    if(req.user.phoneNumber && req.user.phoneNumber === phoneNumber)
      return res.status(400).message("Phone number is same as old one!");
    req.user.phoneNumber = phoneNumber;
    if(!otp) {
      await twoFactorAuthService.sendOtp(req.user, "sms");
      return res.message("6 digit OTP code sent to phone number!");
    }
    const isValid = await twoFactorAuthService.verifyOtp(req.user, "sms", parseInt(otp));
    if(!isValid)
      return res.status(401).message("Invalid OTP. Please  again!");
    await req.user.save();
    res.message("Phone number updated!");
  }
  
  async sendOtp(req: Request, res: Response, @inject twoFactorAuthService: TwoFactorAuthService){
    const user = await User.findById(req.body.userId);
    if(!user) return res.status(404).message();
    twoFactorAuthService.sendOtp(user).catch(log);
    res.message("6 digit OTP code sent to phone number!");
  }
  
  async generateRecoveryCodes(req: Request, res: Response) {
    res.api(await req.user.generateRecoveryCodes());
  }
}