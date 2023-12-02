import type { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { NotificationDocument } from "~/app/models/Notification";
import { formatDistanceToNow } from 'date-fns';

export default abstract class ListNotificationResource extends JsonResource<NotificationDocument> {
  toObject(req: Request) {
    return {
      id: this.resource._id,
      type: this.resource.type,
      unread: this.resource.readAt === null,
      createdAt: formatDistanceToNow(this.resource.createdAt, { addSuffix: true }).replace("about ", "")
    }
  }
}
 