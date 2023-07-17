import Factory from "illuminate/factories/Factory";
import User from "app/models/User";

export default class CommentFactory extends Factory {
  definition() {
    return {
      commentableId: new User()._id,
      commentableType: "Blog",
      commenterId: new User()._id,
      commenterType: "User",
      text: this.faker.lorem.paragraphs(),
    };
  };
}