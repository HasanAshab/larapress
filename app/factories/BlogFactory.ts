import Factory from "~/core/factories/Factory";
import User from "~/app/models/User";

export default class BlogFactory extends Factory {
  definition() {
    return {
      authorId: new User()._id,
      authorType: "User",
      categoryId: new User()._id,
      title: this.faker.lorem.words(),
      content: this.faker.lorem.paragraphs(),
      slug: this.faker.lorem.slug(),
      visibility: "public"
    };
  };
}