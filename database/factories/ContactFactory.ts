import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";

export default class ContactFactory extends Factory {
  definition() {
    return {
      email: faker.internet.email(),
      subject: faker.lorem.words(5),
      message: faker.lorem.words(15),
    };
  };
}