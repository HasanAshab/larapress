import { Request } from "express";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import User from "app/models/User";
import Cache from "illuminate/utils/Cache"
import Mail from "illuminate/utils/Mail"
import PasswordChangedMail from "app/mails/PasswordChangedMail";

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
    const user = await User.findOne({email});
    if (user && await bcrypt.compare(password, user.password)) {
      const userSettings = await user.settings;
      if(userSettings.twoFactorAuth.enabled){
        if(!otp) {
          return {
            status: 200,
            twoFactorAuthRequired: true,
            message: "Credentials matched. otp required!",
          }
        }
        const isValidOtp = await user.verifyOtp(otp);
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

  async verifyEmail(req: Request){
    await User.findByIdAndUpdate(req.params.id, {emailVerified: true}, {new: false});
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
    const user = await User.findOne({
      email,
    });
    if (user) {
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

  async profile(req: Request){
    return req.user;
  };

  async updateProfile(req: Request){
    const logo = req.files?.logo;
    const user = req.user;
    Object.assign(user, req.validated);
    if(req.validated.email){
      user.emailVerified = false;
    }
    if (logo && !Array.isArray(logo)) {
      await user.detach("logo");
      await user.attach("logo", logo, true);
    }
    await user.save();
    if(!req.validated.email) return { message: "Profile updated!" };
    await user.sendVerificationEmail();
    return { message: "Verification email sent to new email!" };
  };
  
  async sendOtp(req: Request){
    const user = await User.findById(req.params.id);
    if(!user) return { status: 404 };
    await user.sendOtp();
    return { message: `6 digit OTP code sent to phone number!`};
  }
}