import Factory from "~/core/factories/Factory";
import User from "~/app/models/User";

export default class VoteFactory implements Factory {
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