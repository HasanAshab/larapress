import { IUser } from "app/models/User";

export default class BlogPolicy {
  delete(user: IUser){
    if(!user.isAdmin) return { _id: user._id };
    return [
      { _id: user._id },
      { isAdmin: false }
    ];
  }
}