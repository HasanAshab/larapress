import Factory from "~/core/factories/Factory";
import { faker } from "@faker-js/faker";

export default class CategoryFactory implements Factory {
  definition() {
    return {
      name: faker.commerce.productName(),
      slug: faker.lorem.slug()
    };
  };
}