import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest, Response } from "~/core/express";

export default class NotificationController {
  @RequestHandler
  async index(req: AuthenticRequest, res: Response) {
    res.api(await req.user.notifications.paginateReq(req));
  }
  
  @RequestHandler
  async markAsRead(req: AuthenticRequest, res: Response, id: string) {
    await req.user.unreadNotifications.findOne({ _id: id }).markAsRead()
      ? res.message('Notification marked as read')
      : res.status(404).message();
  }
  
  @RequestHandler
  async unreadCount(req: AuthenticRequest, res: Response) {
    res.api({
      count: await req.user.unreadNotifications.count()
    });
  }
  
  @RequestHandler
  async delete(req: AuthenticRequest, res: Response, id: string) {
    const { deletedCount } = await req.user.notifications.where("_id").equals(id).deleteOne();
    return deletedCount === 1
      ? res.status(204).message()
      : res.status(404).message();
  }
}

