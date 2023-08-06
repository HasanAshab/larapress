import { IUser } from "app/models/User";

export default class UserPolicy {
  delete(user: IUser){
    if(user.role === "novice") return { _id: user._id };
    return [
      { _id: user._id },
      { role: "admin" }
    ];
  }
}