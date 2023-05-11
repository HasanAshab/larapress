import User from "app/models/User";

export default class SendEmailVerificationNotification {
  async dispatch(user: User){
    await user.sendVerificationEmail();
  }
}