import Factory from "~/core/factories/Factory";
import User from "~/app/models/User";

export default class NotificationFactory extends Factory {
  definition() {
    return {
      userId: new User()._id,
      data: { text: this.faker.lorem.words(5) },
      readAt: new Date()
    };
  };
}