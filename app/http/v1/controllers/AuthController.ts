import RequestHandler from "~/core/decorators/RequestHandler";
import { Request, AuthenticRequest, Response } from "~/core/express";
import LoginRequest from "~/app/http/v1/requests/LoginRequest";
import RegisterRequest from "~/app/http/v1/requests/RegisterRequest";
import LoginWithRecoveryCodeRequest from "~/app/http/v1/requests/LoginWithRecoveryCodeRequest";
import ResendEmailVerificationRequest from "~/app/http/v1/requests/ResendEmailVerificationRequest";
import SendResetPasswordEmailRequest from "~/app/http/v1/requests/SendResetPasswordEmailRequest";
import ResetPasswordRequest from "~/app/http/v1/requests/ResetPasswordRequest";
import ChangePasswordRequest from "~/app/http/v1/requests/ChangePasswordRequest";
import ChangePhoneNumberRequest from "~/app/http/v1/requests/ChangePhoneNumberRequest";
import SendOtpRequest from "~/app/http/v1/requests/SendOtpRequest";
import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";
import { log } from "helpers";
import config from "config"
import URL from "URL";
import Cache from "Cache";
import Mail from "Mail";
import User from "~/app/models/User";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";
import { OAuth2Client } from 'google-auth-library';
import { Mutex } from 'async-mutex';

export default class AuthController {
  @RequestHandler
  async register(req: RegisterRequest, res: Response){
    const { email, username, password } = req.body;
    const logo = req.files?.logo;
    const userExists = await User.exists({
      $or: [ { email }, { username } ] 
    });
    if (userExists)
      return res.status(400).message("username or email already exist!");

    const user = new User({ email, username });
    await user.setPassword(password);
    logo && await user.attach("logo", logo);
    await user.save();
    const token = user.createToken();
    req.app.emit("Registered", user);
    res.status(201).api({
      token,
      message: "Verification email sent!",
    });
  };
  
  @RequestHandler
  async login(req: LoginRequest, res: Response, twoFactorAuthService: TwoFactorAuthService){
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
  
  @RequestHandler
  async loginWithRecoveryCode(req: LoginWithRecoveryCodeRequest, res: Response) {
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
  
  @RequestHandler
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
  
  @RequestHandler
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
  
  @RequestHandler
  async verifyEmail(res: Response, id: string){
    await User.updateOne({ _id: id }, { verified: true });
    res.message("Email verified!");
  };

  @RequestHandler
  async resendEmailVerification(req: ResendEmailVerificationRequest, res: Response){
    User.findOne(req.body).then(user => {
      user && user.sendVerificationEmail().catch(log);
    }).catch(log);
    res.message("Verification email sent!");
  };
  
  @RequestHandler
  async sendResetPasswordEmail(req: SendResetPasswordEmailRequest, res: Response){
    User.findOne(req.body).then(user => {
      user && user.sendResetPasswordEmail().catch(log);
    }).catch(log);
    res.message("Password reset email sent!");
  };

  @RequestHandler
  async resetPassword(req: ResetPasswordRequest, res: Response){
    const { id, password, token } = req.body;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).message();

    return await user.resetPassword(token, password)
      ? res.message("Password changed successfully!")
      : res.status(401).message("Invalid or expired token!");
  };

  @RequestHandler
  async changePassword(req: ChangePasswordRequest, res: Response) {
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
 
  @RequestHandler
  async changePhoneNumber(req: ChangePhoneNumberRequest, res: Response, twoFactorAuthService: TwoFactorAuthService) {
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
  
  @RequestHandler
  async sendOtp(req: SendOtpRequest, res: Response, twoFactorAuthService: TwoFactorAuthService){
    const user = await User.findById(req.body.userId);
    if(!user) return res.status(404).message();
    twoFactorAuthService.sendOtp(user).catch(log);
    res.message("6 digit OTP code sent to phone number!");
  }
  
  @RequestHandler
  async generateRecoveryCodes(req: AuthenticRequest, res: Response) {
    res.api(await req.user.generateRecoveryCodes());
  }
}