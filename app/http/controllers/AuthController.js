const BaseController = controller('BaseController');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = model('User');
const Token = model('Token');
const ForgotPasswordMail = mail('ForgotPasswordMail');
const PasswordChanged = mail('PasswordChanged');
const frontendUrl = process.env.FRONTEND_URL;
const jwtSecret = process.env.JWT_SECRET;
const bcryptRounds = Number (process.env.BCRYPT_ROUNDS);
const tokenLifespan = Number (process.env.TOKEN_LIFESPAN);

class AuthController {
  static register = {
    validator: [
      body('email', 'Not an email').isEmail().custom(value => {
        return User.findOne({email:value}).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }),
      body('name', 'The name length must be between 3 to 12 chars').isLength({min: 3, max: 12}),
      body('password', 'The password must be 8+ chars long').isLength({min: 8})
    ],
    method: async (req, res) => {
      const {name, email, password} = req.body;
      const hash = await bcrypt.hash(password, bcryptRounds);
      const user = await User.create({name, email, password:hash});
      const token = jwt.sign({userId: user._id, version: user.tokenVersion}, jwtSecret, { expiresIn: tokenLifespan });
      user.sendVerificationEmail().then();
      res.json({success: true, message: 'Verification email sent!', token});
      res.status(422).json({success: false, message: 'Registration Failed!'});
    }
  }
  
  static login = {
    validator: [
      body('email', 'Not an email').isEmail(),
      body('password', 'The password field is required').notEmpty()
    ],
    method: async (req, res, next) => {
      const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
          const match = await bcrypt.compare(password, user.password);
          if(match) {
            const token = jwt.sign({userId: user._id, version: user.tokenVersion}, jwtSecret, { expiresIn: tokenLifespan });
            return res.json({success: true, message: 'Logged in successfully!', token});
          }
        }
        res.status(401).json({success:true, message:'Credentials not match!'})
      }
  }
  
  static verifyEmail = {
    validator: [
      body('id', 'The id field is required').notEmpty(),
      body('token', 'The token field is required').notEmpty(),
    ],
    method: async (req, res) => {
      const {id, token} = req.query;
      const verificationToken = await Token.findOne({
        userId: id,
        for:'email_verification'
      });
      if(!verificationToken){
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token!"
        });
      }
      const tokenMatch = await bcrypt.compare(token, verificationToken.token);
      if(!tokenMatch){
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token!"
        });
      }
      User.findByIdAndUpdate(id, {emailVerified:true}, {new:false}).then();
      verificationToken.deleteOne().then();
      res.json({success:true, message:'Email verified!'})
    }
  }
  
  static resendEmailVerification = {
    method: (req, res) => {
      req.user().sendVerificationEmail().then();
      return res.json({success: true, message: 'Verification email sent!'});
    }
  }
  
  static forgotPassword = {
    validator: [
      body('email', 'Not an email').isEmail()
    ],
    method: async (req, res) => {
      const email = req.body.email;
      const user = await User.findOne({email});
      if(user){
        Token.deleteMany({
          userId: user._id,
          for: 'password_reset'
        }).then();
        const resetToken = randStr(128);
        const hash = await bcrypt.hash(resetToken, bcryptRounds);
        const token = Token.create({
          userId: user._id,
          token: hash,
          for: 'password_reset'
        }).then();
        const link = `${frontendUrl}/password/reset?id=${user._id}&token=${resetToken}`;
        user.notify(new ForgotPasswordMail({link}))
      }
      return res.json({success: true, message: 'Password reset email sent!'})
    }
  }
  
  static resetPassword = {
    validator: [
      body('id', 'The id field is required').notEmpty(),
      body('token', 'The token field is required').notEmpty(),
      body('password', 'The password must be 8+ chars long').isLength({min: 8})
    ],
    method: async (req, res) => {
      const {id, token, password} = req.body;
      const user = await User.findById(id);
      const resetToken = await Token.findOne({userId:id});
      if(!resetToken || !user){
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token!"
        });
      }
      const tokenMatch = await bcrypt.compare(token, resetToken.token);
      if(!tokenMatch){
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token!"
        });
      }
      const oldPasswordMatch = await bcrypt.compare(password, user.password);
      if(oldPasswordMatch){
        return res.status(400).json({
          success: false,
          message: "New password should not be same as old one!"
        });
      }
      const hash = await bcrypt.hash(password, bcryptRounds);
      user.password = hash;
      user.tokenVersion++;
      user.save().then();
      resetToken.deleteOne().then();
      return res.json({
        success: false,
        message: "Password reset successfully!"
      });
      user.notify(new PasswordChanged);
    }
  }
  
  static changePassword = {
    validator: [
      body('old_password', 'The old_password field is required').notEmpty(),
      body('password', 'The password must be 8+ chars long').isLength({min: 8})
    ],
    method: async (req, res) => {
      const user = req.user();
      return user.notify(new PasswordChanged);

      const {old_password, password} = req.body;
      const oldPasswordMatch = await bcrypt.compare(old_password, user.password);
      if(!oldPasswordMatch){
        return res.status(401).json({
          success: false,
          message: "Incorrect password!"
        });
      }
      if(old_password === password){
        return res.status(400).json({
          success: false,
          message: "New password should not be same as old one!"
        });
      }
      const hash = await bcrypt.hash(password, bcryptRounds);
      user.password = hash;
      user.tokenVersion++;
      user.save().then();
      return res.json({
        success: false,
        message: "Password changed successfully!"
      });
      user.notify(new PasswordChanged);
    }
  }
  
  static profile = {
    method: (req, res) => {
      req.validate({
        email: 'ndd',
        password: 'akak',
      })
      //res.json(req.user());
    }
  }
}

BaseController.wrapMethods(AuthController);
module.exports = AuthController;