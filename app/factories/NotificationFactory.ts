import Factory from "illuminate/factories/Factory";
import User from "app/models/User";

export default class NotificationFactory extends Factory {
  definition() {
    return {
      notifiableId: new User()._id,
      notifiableType: "User",
      data: {text: this.faker.lorem.paragraphs()},
      readAt: new Date()
    };
  };
}