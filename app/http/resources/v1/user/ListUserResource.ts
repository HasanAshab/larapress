import { Request } from "~/core/express";
import UserResource from "./UserResource";

export default class ListUserResource extends UserResource {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      name: this.resource.name,
      profile: this.profileUrl
    }
  }
}