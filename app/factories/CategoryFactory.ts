import Factory from "~/illuminate/factories/Factory";

export default class CategoryFactory extends Factory {
  definition() {
    return {
      name: this.faker.commerce.productName(),
      slug: this.faker.lorem.slug()
    };
  };
}