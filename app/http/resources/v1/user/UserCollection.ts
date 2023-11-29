import ResourceCollection from "~/core/http/resources/ResourceCollection";
import UserProfileResource from "~/app/http/resources/v1/user/UserProfileResource";

export default class UserCollection extends ResourceCollection {
  collects = UserProfileResource;
  
  toObject(req) {
    return {
      d: this.collection,
      b: 29
    }
  }
}