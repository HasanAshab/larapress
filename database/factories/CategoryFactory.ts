import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";

export default class CategoryFactory extends Factory {
  definition() {
    return {
      name: faker.commerce.productName(),
      slug: faker.lorem.slug()
    };
  };
}