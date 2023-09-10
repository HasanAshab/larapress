import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class NotificationFactory extends Factory {
  definition() {
    return {
      userId: new User()._id,
      data: { text: faker.lorem.words(5) },
      readAt: new Date()
    };
  };
}