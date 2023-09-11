import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";
import { log } from "helpers";
import config from "config"
import User from "~/app/models/User";
import URL from "URL";
import Cache from "Cache";
import Mail from "Mail";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";
import { OAuth2Client } from 'google-auth-library';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

@controller
export default class AuthController {
  async register(req: Request, res: Response){
    const logo = req.files?.logo;
    const user = await User.create(req.body);
    logo && user.attach("logo", logo as any, true).catch(log);
    const token = user.createToken();
    req.app.emit("Registered", user);
    res.status(201).api({
      token,
      message: "Verification email sent!",
    });
  };

  async login(req: Request, res: Response){
    const { email, password, otp } = req.body;
    const attemptCacheKey = "LOGIN-FAILED-ATTEMPTS_" + email;
    let release = await mutex.acquire();
    let failedAttemptsCount = (await Cache.get(attemptCacheKey) ?? 0) as number;
    release();
    if(failedAttemptsCount > 3)
      return res.status(429).message("Too Many Failed Attempts try again later!");
    const user = await User.findOne({ email, password: { $ne: null }});
    if(user && user.password) {
      if (await user.attempt(password)) {
        const userSettings = await user.settings;
        if(userSettings.twoFactorAuth.enabled){
          if(!otp) {
            return res.api({
              twoFactorAuthRequired: true,
              message: "Credentials matched. otp required!"
            });
          }
          const isValidOtp = await user.verifyOtp(parseInt(otp));
          if (!isValidOtp)
            return res.status(401).message("Invalid OTP. Please try again!");
        }
        await Cache.clear(attemptCacheKey);
        const token = user.createToken();
        return res.api({
          token,
          message: "Logged in successfully!",
        });
      }
      release = await mutex.acquire();
      await Cache.put(attemptCacheKey, parseInt(failedAttemptsCount) + 1, 60 * 60);
      release();
    }
    res.status(401).message("Credentials not match!");
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
      const { email, picture: logoUrl } = ticket.getPayload()!;
      const user = await User.findOneAndUpdate(
        { email },
        { logoUrl, verified: true },
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

    const result = await user.resetPassword(token, password);
    if(result)
      return res.message("Password changed successfully!");
    res.status(401).message("Invalid or expired token!");
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
  
  async changePhoneNumber(req: Request, res: Response) {
    req.user.phoneNumber = req.body.phoneNumber;
    await req.user.save();
    res.message("Phone number has been updated successfully!");
  }
  
  async sendOtp(req: Request, res: Response){
    const { userId, method } = req.body;
    const user = await User.findById(userId);
    if(!user) return res.status(404).message();
    const settings = await user.settings;
    if(!settings.twoFactorAuth.enabled)
      return res.status(403).message("Two Factor Auth is disabled for this user!");
    user.sendOtp(method).catch(log);
    res.message("6 digit OTP code sent to phone number!");
  }
}