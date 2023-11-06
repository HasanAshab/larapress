import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import { ICategory, CategoryDocument } from "~/app/models/Category";

export default class CategoryFactory extends Factory<ICategory, CategoryDocument> {
  definition() {
    return {
      name: faker.commerce.productName(),
      slug: faker.lorem.slug(),
      icon: null
    };
  };
}