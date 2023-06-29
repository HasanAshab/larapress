import Notification from "illuminate/notifications/Notification";
import { INotifiable } from "app/plugins/Notifiable";
import VerificationMail from "app/mails/VerificationMail";

export default class T extends Notification {
  via(notifiable: INotifiable){
    return ["database", "mail"];
  }
  
  toMail(notifiable: INotifiable) {
    return new VerificationMail({link:"dhdh"})
  }
  
  toObject(notifiable: INotifiable) {
    return {a:94}
  }
  
}