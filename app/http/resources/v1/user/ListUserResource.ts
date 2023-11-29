import { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { UserDocument } from "~/app/models/User";
import URL from "URL";

export default class ListUserResource extends JsonResource<UserDocument> {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      name: this.resource.name,
      email: this.resource.email,
      username: this.resource.username,
      phoneNumber: this.resource.phoneNumber,
      profile: this.resource.profile && URL.route("v1_media.serve", { id: this.resource.profile }),
      role: this.resource.role
    }
  }
}