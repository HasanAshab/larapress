import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import User, { IUser } from "~/app/models/User";
import { INotification } from "~/app/models/Notification";

export default class NotificationFactory extends Factory {
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
  
  belongsTo(user: IUser) {
    return this.state((notification: INotification) => {
      notification.userId = user._id;
      return notification;
    });
  }

}