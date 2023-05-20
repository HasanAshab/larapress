import faker from "faker";
import Factory from 'illuminate/factories/Factory';

export default class UserFactory extends Factory {
  definition(){
    return {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "password",
    };
  };
}