import { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { UserDocument } from "~/app/models/User";
import URL from "URL";

export default class UserProfileResource extends JsonResource<UserDocument> {
  toObject(req: Request) {
    return {
      id: this.document._id,
      name: this.document.name,
      email: this.document.email,
      username: this.document.username,
      phoneNumber: this.document.phoneNumber,
      profile: this.document.profile && URL.route("v1_media.serve", { id: this.document.profile }),
      role: this.document.role
    }
  }
}