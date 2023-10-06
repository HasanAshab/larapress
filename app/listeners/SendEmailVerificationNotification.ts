import { IUser } from "~/app/models/User";
import { autoInjectable } from "tsyringe";
import AuthService from "~/app/services/AuthService";

//TODO Inject it (may be make custom injector)

//@Injectable
@autoInjectable()
export default class SendEmailVerificationNotification {
  constructor(private readonly authService: AuthService) {}
  
  async dispatch(user: IUser) {//, @inject authService: AuthService){
    await this.authService.sendVerificationLink(user);
  }
}