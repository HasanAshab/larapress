import Factory from "~/illuminate/factories/Factory";
import User from "~/app/models/User";

export default class ReplyFactory extends Factory {
  definition() {
    return {
      commentId: new User()._id,
      replierId: new User()._id,
      replierType: "User",
      text: this.faker.lorem.paragraphs()
    };
  };
}