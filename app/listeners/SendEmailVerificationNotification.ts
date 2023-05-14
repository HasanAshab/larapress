import { Document } from 'mongoose';
import User, {IUser} from "app/models/User";
import { Notifiable } from "app/traits/Notifiable";

export default class SendEmailVerificationNotification {
  async dispatch(user: IUser & Notifiable){
    await user.notify();
  }
}