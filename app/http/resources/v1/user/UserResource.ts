import JsonResource from "~/core/http/resources/JsonResource";
import { UserDocument } from "~/app/models/User";
import URL from "URL";

export default abstract class UserResource extends JsonResource<UserDocument> {
  protected get profileUrl() {
    if(!this.resource.profile)
      return null;
    return URL.route("v1_media.serve", {
      id: this.resource.profile
    });
  }
}