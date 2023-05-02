const Controller = require(base('illuminate/controllers/Controller'));
const bcrypt = require("bcryptjs");
const User = require(base("app/models/User"));
const Token = require(base("app/models/Token"));
const ForgotPasswordMail = require(base("app/mails/ForgotPasswordMail"));
const PasswordChangedMail = require(base("app/mails/PasswordChangedMail"));

class AuthController extends Controller{
  register = async (req, res) => {
    const { name, email, password } = req.body;
    const logo = req.files.logo;
    if (await User.findOne({ email })) {
      return res.status(400).json({
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

  async login(req, res, next){
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = user.createToken();
        return res.json({
          message: "Logged in successfully!",
          token,
        });
      }
    }
    res.status(401).json({
      message: "Credentials not match!",
    });
  };

  verifyEmail = async (req, res) => {
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
        message: "Invalid or expired token!",
      });
    }
    const tokenMatch = await bcrypt.compare(token, verificationToken.token);
    if (!tokenMatch) {
      return res.status(401).json({
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
      message: "Email verified!",
    });
  };

  resendEmailVerification = async (req, res) => {
    await req.user.sendVerificationEmail();
    return res.json({
      message: "Verification email sent!",
    });
  };

  forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
      email,
    });
    if (user) {
      await user.sendResetPasswordEmail();
    }
    return res.json({
      message: "Password reset email sent!",
    });
  };

  resetPassword = async (req, res) => {
    const { id, token, password } = req.body;
    const user = await User.findById(id);
    if (user) {
      await user.resetPassword(token, password)
      return res.json({
        message: "Password reset successfully!",
      });
    }
    return res.status(404).json({
      message: "User not found!",
    });
  };

  changePassword = async (req, res) => {
    const user = req.user;
    const { old_password, password } = req.body;
    const oldPasswordMatch = await bcrypt.compare(old_password, user.password);
    if (!oldPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password!",
      });
    }
    if (old_password === password) {
      return res.status(400).json({
        message: "New password should not be same as old one!",
      });
    }
    user.password = password;
    user.tokenVersion++;
    await user.save();
    await user.notify(new PasswordChangedMail());
    return res.json({
      message: "Password changed successfully!",
    });
  };

  profile = async (req, res) => {
    res.json(req.user);
  };

  updateProfile = async (req, res) => {
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
        message: "Verification email sent!",
      });
    }
  };
}

module.exports = AuthController;
