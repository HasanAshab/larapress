const faker = require("faker");
const Factory = require(base('app/factories/Factory'));

class UserFactory extends Factory {
  definition = () => {
    return {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "password",
    };
  };
}

module.exports = UserFactory;
