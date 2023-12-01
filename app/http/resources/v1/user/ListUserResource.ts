import { Request } from "~/core/express";
import UserResource from "./UserResource";

export default class ListUserResource extends UserResource {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      username: this.resource.username,
      profile: this.profileUrl
    }
  }
  
  withResponse(req: Request, res: Response) {
    res.status(222)
  }
}