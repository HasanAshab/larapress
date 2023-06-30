import Queueable from "illuminate/queue/Queueable";
import { Document } from "mongoose";
import Mail from "illuminate/utils/Mail";
import Mailable from "illuminate/mails/Mailable";
import NotificationModel from "app/models/Notification";

export default abstract class Notification extends Queueable {
  constructor(public data: object) {
    super();
    this.data = data;
  }
  
  abstract via(notifiable: Document): string[];
  abstract toMail?(notifiable: Document): Mailable;
  abstract toObject?(notifiable: Document): object;
  
  async sendMail(notifiable: Document){
    if(this.toMail && "email" in notifiable && typeof notifiable.email === "string"){
      Mail.to(notifiable.email).send(this.toMail(notifiable));
    }
  }
  
  async sendDatabase(notifiable: Document){
    await NotificationModel.create({
      notifiableType: (notifiable.constructor as any).modelName,
      notifiableId: notifiable._id,
      data: this.data
    })
  }
}