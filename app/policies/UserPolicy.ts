import { UserDocument } from "~/app/models/User";

export default class UserPolicy {
  delete(user: UserDocument, targetUser: UserDocument){
    return user._id.toString() === targetUser._id.toString() ||
      (user.role === "admin" && targetUser.role !== "admin");
  }
}