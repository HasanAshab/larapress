import { Notifiable } from "types";
import mongoose, { Document } from "mongoose";
import Mail from "illuminate/utils/Mail";
import Mailable from "illuminate/mails/Mailable";
import NotificationModel from "app/models/Notification";

export default abstract class Notification {
  shouldQueue = false;
  concurrency = {
    mail: 25,
    database: 1
  }
  
  constructor(public data: Record<string, unknown>) {
    this.data = data;
  }
  
  abstract via(notifiable: Notifiable): string[];
  abstract toMail?(notifiable: Notifiable): Mailable;
  abstract toDatabase?(notifiable: Notifiable): object;
  
  async sendMail(notifiable: Notifiable) {
    if(this.toMail && "email" in notifiable && typeof notifiable.email === "string"){
      //await Mail.to(notifiable.email).send(this.toMail(notifiable));
    }
  }

  async sendDatabase(notifiable: Notifiable) {
    if(this.toDatabase){
      //const NotifiableModel = mongoose.model(notifiable.modelName);
      //notifiable = await NotifiableModel.findById(notifiable._id);
      const notification = await NotificationModel.create({
        notifiableType: notifiable.modelName,
        notifiableId: notifiable._id,
        data: this.toDatabase(notifiable)
      });
      //notifiable.notifications.push(notification._id);
      //await notifiable.save();
    }
  }
}