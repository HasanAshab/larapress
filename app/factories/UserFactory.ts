import Factory from "illuminate/factories/Factory";

export default class UserFactory extends Factory {
  definition() {
    return {
      username: this.faker.person.firstName(),
      email: this.faker.internet.email(),
      password: "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi", // "password"
      emailVerified: true
    };
  };
}