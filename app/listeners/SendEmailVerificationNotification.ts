import { IUser } from "app/models/User";

export default class SendEmailVerificationNotification {
  async dispatch(user: IUser){
    await user.sendVerificationEmail();
  }
}