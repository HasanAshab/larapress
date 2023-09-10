import Factory from "~/core/abstract/Factory";
import User from "~/app/models/User";

export default class VoteFactory extends Factory {
  definition() {
    return {
      voteableId: new User()._id,
      voteableType: "Comment",
      voterId: new User()._id,
      voterType: "User",
      reaction: "like"
    };
  }
}