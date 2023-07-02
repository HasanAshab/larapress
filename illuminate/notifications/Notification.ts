import { Document } from "mongoose";
import Mail from "illuminate/utils/Mail";
import Mailable from "illuminate/mails/Mailable";
import NotificationModel from "app/models/Notification";

export default abstract class Notification {
  shouldQueue = false;
  concurrency = {
    mail: 25,
    database: 20
  }
  
  constructor(public data: Record<string, unknown>) {
    this.data = data;
  }
  
  abstract via(notifiable: Document): string[];
  abstract toMail?(notifiable: Document): Mailable;
  abstract toDatabase?(notifiable: Document): object;
  
  async sendMail(notifiable: Document){
    if(this.toMail && "email" in notifiable && typeof notifiable.email === "string"){
      await Mail.to(notifiable.email).send(this.toMail(notifiable));
    }
  }

  async sendDatabase(notifiable: Document){
    if(this.toDatabase){
      await NotificationModel.create({
        notifiableType: notifiable.modelName,
        notifiableId: notifiable._id,
        data: this.toDatabase(notifiable)
      });
    }
  }
}