import { IUser } from "~/app/models/User";

export default class UserPolicy {
  delete(user: IUser, targetUser: IUser){
    return user._id.toString() === targetUser._id.toString() ||
      (user.role === "admin" && targetUser.role !== "admin");
  }
}