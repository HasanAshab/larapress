import { UserDocument } from "~/app/models/User";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export default class SendEmailVerificationNotification {
  async dispatch(user: UserDocument) {
    await user.sendVerificationNotification();
  }
}