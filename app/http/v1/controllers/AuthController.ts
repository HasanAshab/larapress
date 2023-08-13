import { Request, Response } from "express";
import { log } from "helpers";
import config from "config"
import bcrypt from "bcryptjs";
import User from "app/models/User";
import URL from "illuminate/utils/URL";
import Cache from "illuminate/utils/Cache";
import Mail from "illuminate/utils/Mail";
import PasswordChangedMail from "app/mails/PasswordChangedMail";
import { OAuth2Client } from 'google-auth-library';
import { generateFromEmail } from "unique-username-generator";

export default class AuthController {
  async register(req: Request){
    const logo = req.files?.logo;
    const user = await User.create(req.validated);
    logo && await user.attach("logo", logo as any, true);
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
    if (user && user.password && await bcrypt.compare(password, user.password)) {
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
      const { clientId, clientSecret, redirectUrl } = config.get("socialate.google");
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
        { 
          username: generateFromEmail(email!, 4).substr(0, 12), 
          logoUrl: picture,
          verified: true
        },
        {
          upsert: true,
          new: true
        }
      );
      const frontendClientUrl = URL.client("oauth/success?token=" + user.createToken());
      res.redirect(frontendClientUrl);
    }
    catch (err: any) {
      log(err);
      res.redirect(URL.client("oauth/error"));
    }
  }
  
  async redirectToGoogle(req: Request, res: Response) {
    try {
      const { clientId, clientSecret } = config.get("socialate.google");
      const client = new OAuth2Client(clientId, clientSecret);
      const redirectUrl = client.generateAuthUrl({
        scope: ['profile', 'email'],
        redirect_uri: redirectUrl
      });
      res.redirect(redirectUrl);
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
    const user = await User.findOne({email: req.validated.email});
    user && await user.sendVerificationEmail();
    return {
      message: "Verification email sent!",
    };
  };

  async forgotPassword(req: Request){
    const email = req.validated.email;
    const user = await User.findOne({ email });
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
    const oldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
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
    await user.sendOtp(method);
    return { message: `6 digit OTP code sent to phone number!`};
  }
}