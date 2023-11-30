import { Request } from "~/core/express";
import UserResource from "./UserResource";

export default class UserProfileResource extends UserResource {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      name: this.resource.name,
      email: this.resource.email,
      phoneNumber: this.resource.phoneNumber,
      username: this.resource.username,
      profile: this.profileUrl,
      role: this.resource.role
    }
  }
}