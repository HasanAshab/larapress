import Factory from "illuminate/factories/Factory";
import User from "app/models/User";

export default class VoteFactory extends Factory {
  definition() {
    voteableId: new User()._id,
    voteableType: "Comment",
    voterId: new User()._id,
    voterType: "User",
    reaction: "like",
  };
}