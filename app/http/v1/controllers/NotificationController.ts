import Controller from "~/core/abstract/Controller";
import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest } from "~/core/express";

export default class NotificationController extends Controller {
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
  async delete(req: AuthenticRequest, res: Response, id: string) {
    const { deletedCount } = await req.user.notifications.where("_id").equals(id).deleteOne();
    res.status(deletedCount === 1 ? 204 : 404).message()
  }
}

