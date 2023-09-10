import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class BlogFactory extends Factory {
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