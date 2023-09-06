import Factory from "~/core/factories/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class BlogFactory implements Factory {
  definition() {
    return {
      authorId: new User()._id,
      authorType: "User",
      categoryId: new User()._id,
      title: faker.lorem.words(4),
      content: faker.lorem.paragraphs(2),
      slug: faker.lorem.slug(),
      visibility: "public"
    };
  };
}