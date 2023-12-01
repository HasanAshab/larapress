import { Request } from "~/core/express";
import UserResource from "./UserResource";

export default class ShowUserResource extends UserResource {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      name: this.resource.name,
      username: this.resource.username,
      profile: this.profileUrl,
      role: this.resource.role
    }
  }
  
  withResponse(req, res) {
    res.set("Cache-control", `public, max-age=100`);
  }
}