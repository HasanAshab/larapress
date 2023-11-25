import { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { UserDocument } from "~/app/models/User";
import URL from "URL";

export default class UserResource extends JsonResource<UserDocument> {
  wrap = "user";
  
  toObject(req: Request) {
    return {
      id: this.document._id,
      username: this.document.username,
      profile: this.document.profile && URL.route("v1_media.serve", { id: this.document.profile }),
    }
  }
}