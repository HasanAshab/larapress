import { Document } from 'mongoose';
import User, {IUser} from "app/models/User";

export default class SendEmailVerificationNotification {
  async dispatch(user: IUser){
    await user.notify();
  }
}