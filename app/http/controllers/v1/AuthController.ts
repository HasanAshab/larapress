import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { Request, AuthenticRequest, Response } from "~/core/express";
import { injectable } from "tsyringe";
import LoginRequest from "~/app/http/requests/v1/LoginRequest";
import RegisterRequest from "~/app/http/requests/v1/RegisterRequest";
import LoginWithRecoveryCodeRequest from "~/app/http/requests/v1/LoginWithRecoveryCodeRequest";
import ExternalLoginFinalStepRequest from "~/app/http/requests/v1/ExternalLoginFinalStepRequest";
import ResendEmailVerificationRequest from "~/app/http/requests/v1/ResendEmailVerificationRequest";
import SendResetPasswordEmailRequest from "~/app/http/requests/v1/SendResetPasswordEmailRequest";
import ResetPasswordRequest from "~/app/http/requests/v1/ResetPasswordRequest";
import ChangePasswordRequest from "~/app/http/requests/v1/ChangePasswordRequest";
import ChangePhoneNumberRequest from "~/app/http/requests/v1/ChangePhoneNumberRequest";
import AuthService from "~/app/services/auth/AuthService";
import TwoFactorAuthService from "~/app/services/auth/TwoFactorAuthService";
import PasswordService from "~/app/services/auth/PasswordService";
import Event from "~/core/Event";
import User, { UserDocument } from "~/app/models/User";
import Token from "~/app/models/Token";
import Socialite from "Socialite";
import URL from "URL";

@injectable()
export default class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }
  
  @RequestHandler
  /*
  @ApiCreatedResponse({
    message: "The user is successfully registered",
    example: {
      message: 
      token: 
    }
  })*/
  async register(req: RegisterRequest, res: Response){
    const { email, username, password } = req.body;
    const user = await this.authService.register(email, username, password, req.files.profile);
    Event.emit("Registered", { 
      user, 
      version: "v1",
      method: "internal"
    });
    const profile = URL.route("v1_users.show", { username: user.username });
    res.header("Location", profile).status(201).api({
      token: user.createToken(),
      data: { user },
      expiration: Date.now() + Config.get("jwt.expiration"),
      message: "Verification email sent!",
    });
  }
  
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
    return await user.verifyRecoveryCode(code)
      ? {
        token: user.createToken(),
        message: "Logged in successfully!",
      }
      : res.status(401).message("Invalid recovery code!");
  }
  
  @RequestHandler
  async redirectToSocialLoginProvider(req: Request, res: Response, provider: string) {
    Socialite.driver(provider).redirect(res);
  }
  
  @RequestHandler
  async loginWithSocialProvider(req: Request, res: Response, provider: string) {
    const { code } = req.query;
    if(typeof code !== "string")
      return res.redirectToClient("/login/social/error");
    const url = await this.authService.loginWithExternalProvider(provider, code);
    res.redirect(url);
  }
  
  @RequestHandler
  async socialLoginFinalStep(req: ExternalLoginFinalStepRequest, res: Response, provider: string) {
    const { externalId, token, username, email } = req.body;
    const user = await this.authService.externalLoginFinalStep(provider, externalId, token, username, email);
    Event.emit("Registered", { 
      user, 
      version: "v1",
      method: "social"
    });
    const profile = URL.route("v1_users.show", { username: user.username });
    res.header("Location", profile).status(201).api({
      token: user.createToken(),
      message: "Account created!"
    });
  }
  
  @RequestHandler
  async verifyEmail(res: Response, id: string, token: string) {
    await Token.verify(id, "verifyEmail", token);
    await User.updateOne({ _id: id }, { verified: true });
    res.redirectToClient("/email/verify/success");
  };

  @RequestHandler
  async resendEmailVerification(req: ResendEmailVerificationRequest){
    const user = await User.findOne(req.body);
    if(user && !user.verified)
      await user.sendVerificationNotification("v1");
    return "Verification link sent to email!";
  };
  
  @RequestHandler
  async sendResetPasswordEmail(req: SendResetPasswordEmailRequest, res: Response){
    const user = await User.findOne(req.body);
    if(user?.password)
      await user.sendResetPasswordNotification();
    res.status(202).message("Password reset link sent to email!");
  };

  @RequestHandler
  async resetPassword(req: ResetPasswordRequest, passwordService: PasswordService){
    const { id, password, token } = req.body;
    const user = await User.findByIdOrFail(id);
    await passwordService.reset(user, token, password);
    return "Password changed successfully!";
  };

  @RequestHandler
  async changePassword(req: ChangePasswordRequest, passwordService: PasswordService) {
    const { oldPassword, newPassword } = req.body;
    await passwordService.change(req.user, oldPassword, newPassword);
    return "Password changed!";
  };
 
  @RequestHandler
  async changePhoneNumber(req: ChangePhoneNumberRequest, res: Response, twoFactorAuthService: TwoFactorAuthService) {
    const { phoneNumber, otp } = req.body;
    if(req.user.phoneNumber && req.user.phoneNumber === phoneNumber)
      return res.status(400).message("Phone number is same as old one!");
    req.user.phoneNumber = phoneNumber;
    if(!otp) {
      await twoFactorAuthService.sendOtp(req.user, "sms");
      return "6 digit OTP code sent to phone number!";
    }
    await twoFactorAuthService.verifyOtp(req.user, "sms", otp);
    await req.user.save();
    return "Phone number updated!";
  }
  
  @RequestHandler
  async sendOtp(user: UserDocument, twoFactorAuthService: TwoFactorAuthService) {
    twoFactorAuthService.sendOtp(user).catch(log);
    return "6 digit OTP code sent to phone number!";
  }
  
  @RequestHandler
  async generateRecoveryCodes({ user }: AuthenticRequest) {
    return await user.generateRecoveryCodes();
  }
}