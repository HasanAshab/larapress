import { IUser } from "~/app/models/User";
import { autoInjectable } from "tsyringe";
import AuthService from "~/app/services/AuthService";


@autoInjectable()
export default class SendEmailVerificationNotification {
  constructor(private readonly authService: AuthService) {}
  
  async dispatch(user: IUser) {
    await this.authService.sendVerificationLink(user);
  }
}