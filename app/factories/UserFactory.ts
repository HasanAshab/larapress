import Factory from "illuminate/factories/Factory";
import bcrypt from "bcryptjs";

export default class UserFactory extends Factory {
    async definition() {
    const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);
    return {
      name: this.faker.internet.userName().substr(0, 12),
      email: this.faker.internet.email(),
      password: await bcrypt.hash("password", bcryptRounds),
      emailVerified: true
    };
  };
}