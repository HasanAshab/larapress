import { Document } from "mongoose";
import Notification from "illuminate/notifications/Notification";
import VerificationMail from "app/mails/VerificationMail";

export default class T extends Notification {
  via(notifiable: Document){
    return ["database", "mail"];
  }
  
  toMail(notifiable: Document) {
    return new VerificationMail({link:"dhdh"})
  }
  
  toObject(notifiable: Document) {
    return {a:94}
  }
  
}