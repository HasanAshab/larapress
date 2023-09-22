import Controller from "~/core/decorators/controller";
import { Request, Response } from "express";

@Controller
export default class NotificationController {
  async index(req: Request, res: Response) {
    res.api(await req.user.notifications.paginateReq(req));
  }
  
  async markAsRead(req: Request, res: Response) {
    await req.user.unreadNotifications.findOne({ _id: req.params.id }).markAsRead()
      ? res.message('Notification marked as read')
      : res.status(404).message();
  }
  
  async unreadCount(req: Request, res: Response) {
    res.api({
      count: await req.user.unreadNotifications.count()
    });
  }
  
  async delete(req: Request, res: Response) {
    const { deletedCount } = await req.user.notifications.where("_id").equals(req.params.id).deleteOne();
    return deletedCount === 1
      ? res.status(204).message()
      : res.status(404).message();
  }
}

