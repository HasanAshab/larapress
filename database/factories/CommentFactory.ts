import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class CommentFactory extends Factory {
  definition() {
    return {
      commentableId: new User()._id,
      commentableType: "Blog",
      commenterId: new User()._id,
      commenterType: "User",
      text: faker.lorem.paragraphs(),
    };
  };
}