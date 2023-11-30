import type { Request } from "~/core/express";
import JsonResource from "~/core/http/resources/JsonResource";
import { NotificationDocument } from "~/app/models/Notification";
import { formatDistanceToNow } from 'date-fns';
import URL from "URL";

export default abstract class ShowNotificationResource extends JsonResource<NotificationDocument> {
  toObject(req: Request) {
    return {
      data: {
        id: this.resource._id,
        title: this.resource.title,
        message: this.resource.message,
        unread: this.resource.readAt === null,
        createdAt: formatDistanceToNow(this.resource.createdAt, { addSuffix: true }).replace("about ", "")
      },
      
      links: {
        markAsRead: URL.route("notification.markAsRead", { 
          id: this.resource._id
        }),
        delete: URL.route("notification.delete", { 
          id: this.resource._id
        })
      }    
    }
  }
}
 