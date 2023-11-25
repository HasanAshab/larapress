import { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { IUser } from "~/app/models/User";
import URL from "URL";

export default class ShowUserResource extends JsonResource<IUser> {
  toObject(req: Request) {
    return {
      id: this.document._id,
      name: this.document.name,
      username: this.document.username,
      profile: this.document.profile && URL.route("v1_media.serve", { id: this.document.profile })
    }
  }
}