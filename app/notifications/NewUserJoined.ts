import { Notifiable } from "types";
import { Document } from "mongoose";
import Notification from "illuminate/notifications/Notification";
import NewUserJoinedMail from "app/mails/NewUserJoinedMail";

export default class NewUserJoined extends Notification {
  shouldQueue = true;
  
  via(notifiable: Notifiable){
    return ["database", "mail"];
  }
  
  toMail(notifiable: Notifiable) {
    return new NewUserJoinedMail({user: this.data.user});
  }
  
  toDatabase(notifiable: Notifiable) {
    return {user: this.data.user}
  }
}