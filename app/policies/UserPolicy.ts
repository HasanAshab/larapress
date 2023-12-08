import { UserDocument } from "~/app/models/User";
import type { Policy } from "~/app/plugins/HasPolicy";

export default class UserPolicy implements Policy<UserDocument> {
  delete(user: UserDocument, targetUser: UserDocument){
    return user._id.toString() === targetUser._id.toString() ||
      (user.role === "admin" && targetUser.role !== "admin");
  }
}