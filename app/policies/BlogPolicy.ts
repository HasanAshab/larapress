import { IUser } from "app/models/User";

export default class BlogPolicy {
  read(user: IUser){
    if(user.role === "admin") return {};
    return [
      {authorId: user._id},
      {visibility: "public"}
    ];
  }
} 