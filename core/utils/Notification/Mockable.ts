import { IUser } from "~/app/models/User";
import NotificationClass from "~/core/abstract/Notification";
import expect from "expect";

export default class Mockable {
  static isMocked = false;
  static mocked = new Map();
  
  static mock(){
    this.isMocked = true;
    this.mocked.clear();
  }
  
  static async send(notifiables: IUser | IUser[], notification: NotificationClass) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = await notification.via(notifiable);
      const Notification = notification.constructor;
      if(this.mocked.has(Notification)) {
        const notifiablesId = this.mocked.get(Notification).push(notifiable._id);
        this.mocked.set(Notification, notifiablesId);
      }
      else
        this.mocked.set(Notification, [notifiable._id]);
    }
  }
  
  static assertSentTo(notifiables: IUser | IUser[], Notification: typeof NotificationClass){
    if(!this.mocked.has(Notification))
      expect("Notification").toBe("not sent.");
      
    const notifiablesId = Array.isArray(notifiables) ? notifiables.map((notifiable) => notifiable._id).sort() : [notifiables._id];
    const sentNotifiablesId = this.mocked.get(Notification).sort();
    expect(sentNotifiablesId).toHaveLength(notifiablesId.length);
    for(let i = 0; i < notifiablesId.length; i++) {
      expect(sentNotifiablesId[i].toString()).toBe(notifiablesId[i].toString());
    }
  }
  
  static assertNothingSent(){
    expect(this.mocked.size()).toBe(0);
  }
  
  static assertCount(expectedNumber: number){
    expect(this.mocked.size()).toBe(expectedNumber);
  }
}