import { Document } from "mongoose";
import NotificationData from "illuminate/notifications/Notification";
import expect from "expect";

export default class Mockable {
  static isMocked = false;
  static mocked: Record<string, string[]> = {}
  
  static mock(){
    this.isMocked = true;
    this.mocked = {};
  }
  
  static send(notifiables: Document | Document[], notification: NotificationData) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    const notifiablesId = notifiables.map((notifiable) => notifiable._id);
    if(this.mocked[notification.constructor.name]){
      this.mocked[notification.constructor.name].concat(notifiablesId)
    }
    else {
      this.mocked[notification.constructor.name] = notifiablesId;
    }
  }
  
  static assertSentTo(notifiables: Document | Document[], notification: string){
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