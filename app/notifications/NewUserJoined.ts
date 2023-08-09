import { IUser } from "app/models/User";
import Notification from "illuminate/notifications/Notification";
import NewUserJoinedMail from "app/mails/NewUserJoinedMail";

export default class NewUserJoined extends Notification {
  shouldQueue = true;

  via(notifiable: IUser){
    return ["site", "email"];
  }
  
  toEmail(notifiable: IUser) {
    return new NewUserJoinedMail({ user: this.data.user });
  }
  
  toSite(notifiable: IUser) {
    return { user: this.data.user }
  }
}