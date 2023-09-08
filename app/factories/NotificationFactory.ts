import Factory from "~/core/interfaces/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class NotificationFactory implements Factory {
  definition() {
    return {
      userId: new User()._id,
      data: { text: faker.lorem.words(5) },
      readAt: new Date()
    };
  };
}