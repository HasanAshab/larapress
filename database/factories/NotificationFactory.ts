import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import User, { UserDocument } from "~/app/models/User";
import type { INotification, NotificationDocument } from "~/app/models/Notification";

export default class NotificationFactory extends Factory<INotification, NotificationDocument> {
  definition() {
    return {
      userId: new User()._id,
      data: { text: faker.lorem.words(5) },
      readAt: new Date()
    };
  };
  
  unread() {
    return this.state((notification: any) => {
      notification.readAt = null;
      return notification;
    });
  }
  
  belongsTo(user: UserDocument) {
    return this.state((notification: INotification) => {
      notification.userId = user._id;
      return notification;
    });
  }

}