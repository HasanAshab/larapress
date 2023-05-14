import User from "app/models/User";

export default class SendEmailVerificationNotification {
  async dispatch(user: typeof User){
    await user.notify();
  }
}