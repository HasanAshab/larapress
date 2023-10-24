import { IUser } from "~/app/models/User";
import NotificationClass from "~/core/abstract/Notification";

export default class Notification {
  static $data = new Map();
  
  static mockClear(){
    this.$data.clear();
  }
  
  static async send(notifiables: IUser | IUser[], notification: NotificationClass) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = await notification.via(notifiable);
      const Notification = notification.constructor;
      if(this.$data.has(Notification)) {
        const notifiablesId = this.$data.get(Notification).push(notifiable._id);
        this.$data.set(Notification, notifiablesId);
      }
      else
        this.$data.set(Notification, [notifiable._id]);
    }
  }
  
  static assertSentTo(notifiables: IUser | IUser[], Notification: typeof NotificationClass){
    expect(this.$data.has(Notification)).toBe(true);
    const notifiablesId = Array.isArray(notifiables) ? notifiables.map((notifiable) => notifiable._id).sort() : [notifiables._id];
    const sentNotifiablesId = this.$data.get(Notification).sort();
    expect(sentNotifiablesId).toHaveLength(notifiablesId.length);
    for(let i = 0; i < notifiablesId.length; i++) {
      expect(sentNotifiablesId[i].toString()).toBe(notifiablesId[i].toString());
    }
  }
  
  static assertNothingSent(){
    expect(this.$data.size()).toBe(0);
  }
  
  static assertCount(expectedNumber: number){
    expect(this.$data.size()).toBe(expectedNumber);
  }
}