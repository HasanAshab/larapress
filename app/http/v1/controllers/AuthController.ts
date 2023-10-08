import RequestHandler from "~/core/decorators/RequestHandler";
import { Request, AuthenticRequest, Response } from "~/core/express";
import { autoInjectable } from "tsyringe";
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

@autoInjectable()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @RequestHandler
  async register(req: RegisterRequest, res: Response){
    const { email, username, password } = req.body;
    const token = await this.authService.register(email, username, password, req.files.logo);
    res.status(201).api({
      token,
      message: "Verification email sent!",
    });
  };
  
  @RequestHandler
  async login(req: LoginRequest, res: Response) {
    const { email, password, otp } = req.body;
    const token = await this.authService.login(email, password, otp);
    return token
      ? {
        token,
        message: "Logged in successfully!",
      }
      : res.status(401).message("Credentials not match!");
  }

  @RequestHandler
  async loginWithRecoveryCode(req: LoginWithRecoveryCodeRequest, res: Response) {
    const { email, code } = req.body;
    const user = await User.findOneOrFail({ email });
    return await this.authService.verifyRecoveryCode(user, code)
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
      const client = new OAuth2Client(clientId, clientSecret);
      const { tokens } = await client.getToken({ 
        code: req.query.code,
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
  async resendEmailVerification(req: ResendEmailVerificationRequest){
    User.findOne(req.body).then(async user => {
      user && await this.authService.sendVerificationLink(user);
    }).catch(log);
    return "Verification link sent to email!";
  };
  
  @RequestHandler
  async sendResetPasswordEmail(req: SendResetPasswordEmailRequest){
    User.findOne(req.body).then(async user => {
      user && await this.authService.sendResetPasswordLink(user);
    }).catch(log);
    return "Password reset link sent to email!";
  };

  @RequestHandler
  async resetPassword(req: ResetPasswordRequest){
    const { id, password, token } = req.body;
    const user = await User.findByIdOrFail(id);
    await this.authService.resetPassword(user, token, password)
    return "Password changed successfully!";
  };

  @RequestHandler
  async changePassword(req: ChangePasswordRequest) {
    const { oldPassword, newPassword } = req.body;
    await this.authService.changePassword(req.user, oldPassword, newPassword);
    return "Password changed!";
  };
 
  @RequestHandler
  async changePhoneNumber(req: ChangePhoneNumberRequest) {
    const { phoneNumber, otp } = req.body;
    if(req.user.phoneNumber && req.user.phoneNumber === phoneNumber)
      return res.status(400).message("Phone number is same as old one!");
    req.user.phoneNumber = phoneNumber;
    if(!otp) {
      await this.authService.sendOtp(req.user, "sms");
      return "6 digit OTP code sent to phone number!";
    }
    const isValid = await this.authService.verifyOtp(req.user, "sms", parseInt(otp));
    if(!isValid)
      return res.status(401).message("Invalid OTP. Please  again!");
    await req.user.save();
    return "Phone number updated!";
  }
  
  @RequestHandler
  async sendOtp(id: string){
    const user = await User.findByIdOrFail(id);
    this.authService.sendOtp(user).catch(log);
    return "6 digit OTP code sent to phone number!";
  }
  
  @RequestHandler
  async generateRecoveryCodes({ user }: AuthenticRequest) {
    return await this.authService.generateRecoveryCodes(user);
  }
  
  static handlers(...args: any[]) {
    const reqHandlers = {};
    const controller = new this(...args);
    const handlersName = Reflect.getMetadata("handlersName", controller) ?? [];
    for(const name of handlersName) {
      if(name !== "constructor" && name !== "handlers")
        reqHandlers[name] = controller[name].bind(controller);
    }
    return reqHandlers;
  }
}