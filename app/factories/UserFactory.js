const faker = require("faker");
const Factory = require(base('app/factories/Factory'));

class UserFactory extends Factory {
  definition = () => {
    return {
      name: faker.name.findName().substr(0, 20),
      email: faker.internet.email(),
      password: "password",
    };
  };
}

module.exports = UserFactory;
