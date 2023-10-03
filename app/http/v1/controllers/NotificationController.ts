import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest } from "~/core/express";

export default class NotificationController {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await req.user.notifications.paginateReq(req);
  }
  
  @RequestHandler
  async markAsRead(req: AuthenticRequest, id: string) {
    await req.user.unreadNotifications.findOneOrFail({ _id: id }).markAsRead()
    return 'Notification marked as read';
  }
  
  @RequestHandler
  async unreadCount(req: AuthenticRequest) {
    return {
      count: await req.user.unreadNotifications.count()
    };
  }
  
  @RequestHandler
  async delete(req: AuthenticRequest, id: string) {
    const { deletedCount } = await req.user.notifications.where("_id").equals(id).deleteOne();
    return deletedCount === 1
      ? res.status(204).message()
      : res.status(404).message();
  }
}

