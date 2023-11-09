import expect from "expect";
import { NotifiableDocument } from "~/app/plugins/Notifiable";
import NotificationClass from "~/core/abstract/Notification";
import MockDataContainer from "~/tests/MockDataContainer";


export default class Notification {
  static mockClear(){
    MockDataContainer.Notification = new Map();
  }
  
  static async send<DocType extends NotifiableDocument>(notifiables:  DocType | DocType[], notification: NotificationClass<DocType>) {
    notifiables = Array.isArray(notifiables) ? notifiables: [notifiables];
    for (const notifiable of notifiables) {
      const channels = await notification.via(notifiable);
      const Notification = notification.constructor;
      if(MockDataContainer.Notification.has(Notification)) {
        const notifiablesId = MockDataContainer.Notification.get(Notification).push(notifiable._id);
        MockDataContainer.Notification.set(Notification, notifiablesId);
      }
      else
        MockDataContainer.Notification.set(Notification, [notifiable._id]);
    }
  }
  
  static assertSentTo(notifiables: NotifiableDocument | NotifiableDocument[], Notification: typeof NotificationClass){
    expect(MockDataContainer.Notification.has(Notification)).toBe(true);
    const notifiablesId = Array.isArray(notifiables) ? notifiables.map((notifiable) => notifiable._id).sort() : [notifiables._id];
    const sentNotifiablesId = MockDataContainer.Notification.get(Notification).sort();
    expect(sentNotifiablesId).toHaveLength(notifiablesId.length);
    for(let i = 0; i < notifiablesId.length; i++) {
      expect(sentNotifiablesId[i].toString()).toBe(notifiablesId[i].toString());
    }
  }
  
  static assertNothingSent(){
    expect(MockDataContainer.Notification.size()).toBe(0);
  }
  
  static assertCount(expectedNumber: number){
    expect(MockDataContainer.Notification.size()).toBe(expectedNumber);
  }
}

Notification.mockClear();