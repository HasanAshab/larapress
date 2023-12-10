import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { Request, AuthenticRequest, Response } from "~/core/express";
import { injectable } from "tsyringe";
import LoginRequest from "~/app/http/requests/v1/auth/login/LoginRequest";
import RegisterRequest from "~/app/http/requests/v1/auth/RegisterRequest";
import LoginWithRecoveryCodeRequest from "~/app/http/requests/v1/auth/login/LoginWithRecoveryCodeRequest";
import SocialLoginFinalStepRequest from "~/app/http/requests/v1/auth/login/SocialLoginFinalStepRequest";
import ResendEmailVerificationRequest from "~/app/http/requests/v1/auth/ResendEmailVerificationRequest";
import ForgotPasswordRequest from "~/app/http/requests/v1/auth/password/ForgotPasswordRequest";
import ResetPasswordRequest from "~/app/http/requests/v1/auth/password/ResetPasswordRequest";
import SetupTwoFactorAuthRequest from "~/app/http/requests/v1/auth/SetupTwoFactorAuthRequest";
import AuthService from "~/app/services/auth/AuthService";
import TwoFactorAuthService from "~/app/services/auth/TwoFactorAuthService";
import PasswordService from "~/app/services/auth/PasswordService";
import Event from "~/core/events/Event";
import User, { UserDocument } from "~/app/models/User";
import Token from "~/app/models/Token";
import Socialite from "Socialite";
import URL from "URL";

@injectable()
export default class AuthController extends Controller {
  constructor(private readonly authService: AuthService, private readonly twoFactorAuthService: TwoFactorAuthService) {
    super();
  }
  
  @RequestHandler
  async register(req: RegisterRequest, res: Response){
    const { email, username, password } = req.body;
    const user = await this.authService.register(email, username, password, req.file("profile"));
    Event.emit("Registered", { 
      user, 
      version: "v1",
      method: "internal"
    });
    const profile = URL.route("v1_users.show", { username: user.username });
    res.header("Location", profile).status(201).json({
      token: user.createToken(),
      data: { user },
      //expiration: Date.now() + Config.get("jwt.expiration"),
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
    const url = await this.authService.loginWithSocialProvider(provider, code);
    res.redirect(url);
  }
  
  @RequestHandler
  async socialLoginFinalStep(req: SocialLoginFinalStepRequest, res: Response, provider: string) {
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
  async forgotPassword(req: ForgotPasswordRequest, res: Response){
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
  async setupTwoFactorAuth(req: SetupTwoFactorAuthRequest){
    const { enable, method } = req.body;
   
    if(!enable) {
      await this.twoFactorAuthService.disable(req.user);
      return "Two Factor Auth disabled!";
    }
    
    return {
      message: "Two Factor Auth enabled!",
      data: await this.twoFactorAuthService.enable(req.user, method)
    };
  }
  

  @RequestHandler
  async sendOtp(user: UserDocument) {
    this.twoFactorAuthService.sendOtp(user).catch(log);
    return "6 digit OTP code sent to phone number!";
  }
  
  @RequestHandler
  async generateRecoveryCodes({ user }: AuthenticRequest) {
    return await user.generateRecoveryCodes();
  }
}