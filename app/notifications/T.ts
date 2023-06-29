import Notification from "illuminate/notifications/Notification";
import VerificationMail from "app/mails/VerificationMail";

export default class T extends Notification {
  via(){
    return ["database", "mail"];
  }
  
  toMail() {
    return new VerificationMail({link:"dhdh"})
  }
  
  toObject() {
    return {a:94}
  }
  
}