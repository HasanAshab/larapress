import { IUser } from "~/app/models/User";
import Notification from "~/core/abstract/Notification";
import NewUserJoinedMail from "~/app/mails/NewUserJoinedMail";

export default class NewUserJoinedNotification extends Notification {
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