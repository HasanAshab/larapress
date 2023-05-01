const bcrypt = require("bcryptjs");
const User = require(base("app/models/User"));
const Token = require(base("app/models/Token"));
const ForgotPasswordMail = require(base("app/mails/ForgotPasswordMail"));
const PasswordChangedMail = require(base("app/mails/PasswordChangedMail"));

const Controller = require(base('illuminate/controllers/Controller'));

class AuthController extends Controller{
  async register(req, res){
    const { name, email, password } = req.body;
    const logo = req.files.logo;
    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
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
      success: true,
      message: "Verification email sent!",
      token,
    });
  };

  async login(req, res){
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = user.createToken();
        return res.json({
          success: true,
          message: "Logged in successfully!",
          token,
        });
      }
    }
    res.status(401).json({
      success: true,
      message: "Credentials not match!",
    });
  };

  async verifyEmail(req, res){
    const { id, token } = req.query;
    const verificationToken = await Token.findOne(
      {
        userId: id,
        for: "email_verification",
      },
      {},
      { sort: { createdAt: -1 } }
    );
    if (!verificationToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }
    const tokenMatch = await bcrypt.compare(token, verificationToken.token);
    if (!tokenMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }
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
      success: true,
      message: "Email verified!",
    });
  };

  async resendEmailVerification(req, res){
    await req.user.sendVerificationEmail();
    return res.json({
      success: true,
      message: "Verification email sent!",
    });
  };

  async forgotPassword(req, res){
    const email = req.body.email;
    const user = await User.findOne({
      email,
    });
    if (user) {
      await user.sendResetPasswordEmail();
    }
    return res.json({
      success: true,
      message: "Password reset email sent!",
    });
  };

  async resetPassword(req, res){
    const { id, token, password } = req.body;
    const user = await User.findById(id);
    if (user) {
      await user.resetPassword(token, password)
      return res.json({
        success: true,
        message: "Password reset successfully!",
      });
    }
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  };

  async changePassword(req, res){
    const user = req.user;
    const { old_password, password } = req.body;
    const oldPasswordMatch = await bcrypt.compare(old_password, user.password);
    if (!oldPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!",
      });
    }
    if (old_password === password) {
      return res.status(400).json({
        success: false,
        message: "New password should not be same as old one!",
      });
    }
    user.password = password;
    user.tokenVersion++;
    await user.save();
    await user.notify(new PasswordChangedMail());
    return res.json({
      success: false,
      message: "Password changed successfully!",
    });
  };

  async profile(req, res){
    res.json(req.user);
  };

  async updateProfile(req, res){
    const { name, email } = req.body;
    const logo = req.files.logo;
    const user = req.user;
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
      return res.json({
        success: true,
        message: "Verification email sent!",
      });
    }
  };
}

module.exports = AuthController;
