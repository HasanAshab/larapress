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
import AuthService from "~/app/services/AuthService";
import config from "config"
import URL from "URL";
import Mail from "Mail";
import User from "~/app/models/User";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";
import { OAuth2Client } from 'google-auth-library';

export default class AuthController {
  @RequestHandler
  async register(req: RegisterRequest, res: Response, authService: AuthService){
    const { email, username, password } = req.body;
    const token = await authService.register(email, username, password, req.files.logo);
    res.status(201).api({
      token,
      message: "Verification email sent!",
    });
  };
  
  @RequestHandler
  async login(req: LoginRequest, res: Response, authService: AuthService) {
    const { email, password, otp } = req.body;
    const token = await authService.login(email, password, otp);
    return token
      ? {
        token,
        message: "Logged in successfully!",
      }
      : res.status(401).message("Credentials not match!");
  }

  @RequestHandler
  async loginWithRecoveryCode(req: LoginWithRecoveryCodeRequest, res: Response, authService: AuthService) {
    const { email, code } = req.body;
    const user = await User.findOneOrFail({ email });
    return await authService.verifyRecoveryCode(user, code)
      ? {
        token: user.createToken(),
        message: "Logged in successfully!",
      }
      : res.status(401).message("Invalid recovery code!");
  }

//TODO
  @RequestHandler
  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { clientId, clientSecret, redirectUrl } = config.get<any>("socialite.google");

      const { tokens } = await client.getToken({ 
        code,
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
//TODO
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
  async verifyEmail(id: string) {
    await User.updateOne({ _id: id }, { verified: true });
    return "Email verified!";
  };

  @RequestHandler
  async resendEmailVerification(req: ResendEmailVerificationRequest, authService: AuthService){
    User.findOne(req.body).then(async user => {
      user && await authService.sendVerificationLink(user);
    }).catch(log);
    return "Verification link sent to email!";
  };
  
  @RequestHandler
  async sendResetPasswordEmail(req: SendResetPasswordEmailRequest, authService: AuthService){
    User.findOne(req.body).then(async user => {
      user && await authService.sendResetPasswordLink(user);
    }).catch(log);
    return "Password reset link sent to email!";
  };

  @RequestHandler
  async resetPassword(req: ResetPasswordRequest, authService: AuthService){
    const { id, password, token } = req.body;
    const user = await User.findByIdOrFail(id);
    await authService.resetPassword(user, token, password)
    return "Password changed successfully!";
  };

  @RequestHandler
  async changePassword(req: ChangePasswordRequest, authService: AuthService) {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user, oldPassword, newPassword);
    return "Password changed!";
  };
 
  @RequestHandler
  async changePhoneNumber(req: ChangePhoneNumberRequest, authService: AuthService) {
    const { phoneNumber, otp } = req.body;
    if(req.user.phoneNumber && req.user.phoneNumber === phoneNumber)
      return res.status(400).message("Phone number is same as old one!");
    req.user.phoneNumber = phoneNumber;
    if(!otp) {
      await authService.sendOtp(req.user, "sms");
      return "6 digit OTP code sent to phone number!";
    }
    const isValid = await authService.verifyOtp(req.user, "sms", parseInt(otp));
    if(!isValid)
      return res.status(401).message("Invalid OTP. Please  again!");
    await req.user.save();
    return "Phone number updated!";
  }
  
  @RequestHandler
  async sendOtp(authService: AuthService, id: string){
    const user = await User.findByIdOrFail(id);
    authService.sendOtp(user).catch(log);
    return "6 digit OTP code sent to phone number!";
  }
  
  @RequestHandler
  async generateRecoveryCodes({ user }: AuthenticRequest, authService: AuthService) {
    return await authService.generateRecoveryCodes(user);
  }
}