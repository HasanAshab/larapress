import { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { UserDocument } from "~/app/models/User";
import URL from "URL";

export default class UserProfileResource extends JsonResource<UserDocument> {
  toObject(req: Request) {
    const isAuthor = req.user?._id === this.resource._id;
    return {
      id: this.resource._id,
      name: this.resource.name,
      email: this.when(isAuthor, this.resource.email),
      phoneNumber: this.when(isAuthor, this.resource.phoneNumber),
      username: this.resource.username,
      profile: this.resource.profile && URL.route("v1_media.serve", { id: this.resource.profile }),
      role: this.resource.role
    }
  }
}