import Factory from "~/core/factories/Factory";

export default class ContactFactory extends Factory {
  definition() {
    return {
      email: this.faker.internet.email(),
      subject: this.faker.lorem.words(5),
      message: this.faker.lorem.words(15),
    };
  };
}