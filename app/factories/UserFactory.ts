import Factory from "illuminate/factories/Factory";

export default class UserFactory extends Factory {
  definition(): Record<string, any> {
    return {
      name: this.faker.internet.userName().substr(0, 12),
      email: this.faker.internet.email(),
      password: "password",
    };
  };
}