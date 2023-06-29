import Mailable from "illuminate/mails/Mailable";
import { INotifiable } from "app/plugins/Notifiable";

export default abstract class Notification {
  constructor(public data: object) {
    this.data = data;
  }
  abstract via(notifiable: INotifiable): string[];
  abstract toMail?(notifiable: INotifiable): Mailable;
  abstract toObject?(notifiable: INotifiable): object;
  
  sendMail(notifiable: INotifiable){
    console.log("mail")
  }
  
  sendDatabase(notifiable: INotifiable){
    console.log("db")
  }
}