import { Request, Response } from "express";
import { log } from "helpers";
import config from "config"
import User from "~/app/models/User";
import URL from "URL";
import Cache from "Cache";
import Mail from "Mail";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";
import { OAuth2Client } from 'google-auth-library';
import { generateFromEmail } from "unique-username-generator";

export default class AuthController {
  async register(req: Request){
    const logo = req.files?.logo;
    const user = await User.create(req.validated);
    logo && user.attach("logo", logo as any, true).catch(log);
    const token = user.createToken();
    req.app.emit("Registered", user);
    return {
      status: 201,
      token,
      message: "Verification email sent!",
    };
  };

  async login(req: Request){
    const { email, password, otp } = req.validated;
    const attemptCacheKey = "LOGIN-FAILED-ATTEMPTS_" + email;
    let failedAttemptsCount = (await Cache.get(attemptCacheKey) ?? 0) as number;
    if(failedAttemptsCount > 3) {
      return {
        status: 429,
        message: "Too Many Failed Attempts try again later!"
      }
    }
    const user = await User.findOne({ email, password: { $ne: null }});
    if (user && user.password && await user.attempt(password)) {
      const userSettings = await user.settings;
      if(userSettings.twoFactorAuth.enabled){
        if(!otp) {
          return {
            status: 200,
            twoFactorAuthRequired: true,
            message: "Credentials matched. otp required!",
          }
        }
        const isValidOtp = await user.verifyOtp(parseInt(otp));
        if (!isValidOtp){
          return {
            status: 401,
            message: "Invalid OTP. Please try again!",
          };
        }
      }
      await Cache.clear(attemptCacheKey);
      const token = user.createToken();
      return {
        token,
        message: "Logged in successfully!",
      };
    }
    await Cache.put(attemptCacheKey, failedAttemptsCount+1, 60 * 60);
    return {
      status: 401,
      message: "Credentials not match!"
    }
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
      const { email, picture: logoUrl, sub } = ticket.getPayload()!;
      const user = await User.findOneAndUpdate(
        { email },
        { logoUrl, verified: true },
        { upsert: true, new: true }
      );
      const frontendClientUrl = user.username
        ? URL.client("oauth/success?token=" + user.createToken())
        : URL.client("oauth/set-username?token=" + user.createToken());
      return res.redirect(frontendClientUrl);
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
  
  async verifyEmail(req: Request){
    await User.findByIdAndUpdate(req.params.id, {verified: true}, {new: false});
    return {
      message: "Email verified!",
    };
  };

  async resendEmailVerification(req: Request){
    const user = await User.findOne(req.validated);
    user && user.sendVerificationEmail().catch(log);
    return {
      message: "Verification email sent!",
    };
  };

  async sendResetPasswordEmail(req: Request){
    const user = await User.findOne(req.validated);
    if (user) {
      if(!user.password) {
        return {
          status: 400,
          message: "This action is not available for OAuth account!"
        }
      }
      await user.sendResetPasswordEmail();
    }
    return {
      message: "Password reset email sent!",
    };
  };

  async resetPassword(req: Request){
    const { id, password, token } = req.validated;
    const user = await User.findById(id);
    if (user) {
      await user.resetPassword(token, password);
      return {
        message: "Password changed successfully!",
      };
    }
    return {
      status: 404,
      message: "User not found!",
    };
  };

  async changePassword(req: Request){
    const user = req.user;
    if(!user.password) {
      return {
        status: 400,
        message: "This action is not available for OAuth account!"
      }
    }
    const { oldPassword, password } = req.validated;
    const oldPasswordMatch = await user.attempt(oldPassword);
    if (!oldPasswordMatch) {
      return {
        status: 401,
        message: "Incorrect password!"
      }
    }
    user.password = password;
    user.tokenVersion++;
    await user.save();
    await Mail.to(user.email).send(new PasswordChangedMail());
    return { message: "Password changed!" };
  };
  
  async changePhoneNumber(req: Request){
    req.user.phoneNumber = req.validated.phoneNumber;
    await req.user.save();
    return {
      message: "Phone number has been updated/ set successfully!",
    };
  }
  
  async sendOtp(req: Request){
    const { userId, method } = req.validated;
    const user = await User.findById(userId);
    if(!user) return { status: 404 };
    const settings = await user.settings;
    if(!settings.twoFactorAuth.enabled) {
      return { 
        status: 403,
        message: "Two Factor Auth is disabled for this user!"
      };
    }
    user.sendOtp(method);
    return { message: `6 digit OTP code sent to phone number!` };
  }
}