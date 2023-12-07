import JsonResource from "~/core/http/resources/JsonResource";
import type { Request } from "~/core/express";
import type { ContactDocument } from "~/app/models/Contact";
import { formatDistanceToNow } from 'date-fns';

export default abstract class ShowContactResource extends JsonResource<ContactDocument> {
  toObject(req: Request) {
    this.resource.createdAt = formatDistanceToNow(this.resource.createdAt, { addSuffix: true }).replace("about ", "");
    return this.resource;
  }
}
 
 