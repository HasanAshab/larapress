import Factory from "illuminate/factories/Factory";
import User from "app/models/User";

export default class Notification extends Factory {
  definition(): Record<string, any> {
    return {
      notifiableId: new User()._id,
      notifiableType: "User",
      data: {foo: "bar"},
      readAt: new Date()
    };
  };
}