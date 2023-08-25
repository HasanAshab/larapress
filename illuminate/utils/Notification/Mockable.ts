import { IUser } from "~/app/models/User";
import NotificationData from "~/illuminate/notifications/Notification";
import expect from "expect";

export default class Mockable {
  static isMocked = false;
  static mocked: Record<string, string[]> = {}
  
  static mock(){
    this.isMocked = true;
    this.mocked = {};
  }
  
  static async send(notifiables: IUser | IUser[], notification: NotificationData) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = await notification.via(notifiable);
      const settings = await notifiable.settings;
      if(!("type" in notification) || channels.some((channel) => settings.notification[notification.type!][channel])) {
        if(this.mocked[notification.constructor.name]){
          this.mocked[notification.constructor.name].push(notifiable._id);
        }
        else {
          this.mocked[notification.constructor.name] = [notifiable._id];
        }
      }
    }
  }
  
  static assertSentTo(notifiables: IUser | IUser[], notification: string){
    const notifiablesId = Array.isArray(notifiables) ? notifiables.map((notifiable) => notifiable._id).sort() : [notifiables._id];
    const sentNotifiablesId = this.mocked[notification].sort();
    expect(sentNotifiablesId).toHaveLength(notifiablesId.length);
    for(let i = 0; i < notifiablesId.length; i++)
      expect(sentNotifiablesId[i].toString()).toBe(notifiablesId[i].toString());
  }
  
  static assertNothingSent(){
    expect(Object.keys(this.mocked)).toHaveLength(0);
  }
  
  static assertCount(expectedNumber: number){
    expect(Object.keys(this.mocked)).toHaveLength(expectedNumber);
  }
}