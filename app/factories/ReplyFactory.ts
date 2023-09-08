import Factory from "~/core/interfaces/Factory";
import { faker } from "@faker-js/faker";
import User from "~/app/models/User";

export default class ReplyFactory implements Factory {
  definition() {
    return {
      commentId: new User()._id,
      replierId: new User()._id,
      replierType: "User",
      text: faker.lorem.paragraphs()
    };
  };
}