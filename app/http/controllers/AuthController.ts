import { Request } from "types";
import { Response } from "express";
import { log } from "helpers";
import Controller from "illuminate/controllers/Controller";
import AuthenticationError from 'app/exceptions/AuthenticationError';
import bcrypt from "bcryptjs";
import User from "app/models/User";
import Token from "app/models/Token";
import ForgotPasswordMail from "app/mails/ForgotPasswordMail";
import PasswordChangedMail from "app/mails/PasswordChangedMail";

export default class AuthController extends Controller {
  async register(req: Request, res: Response){
    const { name, email, password } = req.body;
    const logo = req.files.logo;
    if (await User.findOne({ email })) {
      res.status(400).json({
        message: "Email already exist!",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (logo) {
      await user.attachFile("logo", logo, true);
    }
    const token = user.createToken();
    req.app.emit('Registered', user);
    res.status(201).json({
      message: "Verification email sent!",
      token,
    });
  };

  async login(req: Request, res: Response){
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = user.createToken();
         res.json({
          message: "Logged in successfully!",
          token,
        });
      }
    }
    res.status(401).json({
      message: "Credentials not match!",
    });
  };

  async verifyEmail(req: Request, res: Response){
    const { id, token } = req.validated;
    const verificationToken = await Token.findOne(
      {
        userId: id,
        for: "email_verification",
      },
      {},
      { sort: { createdAt: -1 } }
    );
    if (!verificationToken) throw AuthenticationError.type('INVALID_OR_EXPIRED_TOKEN').create();
    const tokenMatch = await bcrypt.compare(token, verificationToken.token);
    if (!tokenMatch) throw AuthenticationError.type('INVALID_OR_EXPIRED_TOKEN').create();

    await User.findByIdAndUpdate(
      id,
      {
        emailVerified: true,
      },
      {
        new: false,
      }
    );
    verificationToken.deleteOne().catch((err) => log(err));
    res.json({
      message: "Email verified!",
    });
  };

  async resendEmailVerification(req: Request, res: Response){
    await req.user!.sendVerificationEmail();
     res.json({
      message: "Verification email sent!",
    });
  };

  async forgotPassword(req: Request, res: Response){
    const email = req.body.email;
    const user = await User.findOne({
      email,
    });
    if (user) {
      await user.sendResetPasswordEmail();
    }
     res.json({
      message: "Password reset email sent!",
    });
  };

  async resetPassword(req: Request, res: Response){
    const { id, token, password } = req.body;
    const user = await User.findById(id);
    if (user) {
      await user.resetPassword(token, password)
       res.json({
        message: "Password reset successfully!",
      });
    }
     res.status(404).json({
      message: "User not found!",
    });
  };

  async changePassword(req: Request, res: Response){
    const user = req.user!;
    const { old_password, password } = req.body;
    const oldPasswordMatch = await bcrypt.compare(old_password, user.password);
    if (!oldPasswordMatch) {
       res.status(401).json({
        message: "Incorrect password!",
      });
    }
    if (old_password === password) {
       res.status(400).json({
        message: "New password should not be same as old one!",
      });
    }
    user.password = password;
    user.tokenVersion++;
    await user.save();
    await user.notify(new PasswordChangedMail());
     res.json({
      message: "Password changed successfully!",
    });
  };

  async profile(req: Request, res: Response){
     res.json({data:req.user!});
  };

  async updateProfile(req: Request, res: Response){
    const { name, email } = req.body;
    const logo = req.files.logo;
    const user = req.user!;
    user.name = name;
    user.email = email;
    user.emailVerified = false;
    const result = await user.save();
    if (logo) {
      await user.removeFiles("logo");
      await user.attachFile("logo", logo, true);
    }
    if (result) {
      await user.sendVerificationEmail();
       res.json({
        message: "Verification email sent!",
      });
    }
  };
}

module.exports = new AuthController();
