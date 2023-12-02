import type { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { NotificationDocument } from "~/app/models/Notification";
import { formatDistanceToNow } from 'date-fns';
import URL from "URL";

export default abstract class ShowNotificationResource extends JsonResource<NotificationDocument> {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      type: this.resource.type,
      data: this.resource.data,
      unread: this.resource.readAt === null,
      readAt: this.resource.readAt,
      createdAt: formatDistanceToNow(this.resource.createdAt, { addSuffix: true }).replace("about ", "")
    }
  }
}
 