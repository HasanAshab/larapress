import Factory from "~/core/interfaces/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class CommentFactory implements Factory {
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