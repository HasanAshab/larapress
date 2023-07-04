import { Request } from "express";
import User from "app/models/User";

export default class NotificationController {
  async index(req: Request) {
    await req.user!.markNotificationsAsRead();
    return { notifications: await req.user!.notifications };
  }
  
  async unreadCount(req: Request) {
    return { count: await req.user!.unreadNotifications.count() };
  }
  
  async delete(req: Request) {
    await req.user!.notifications.where("_id").equals(req.params.id).deleteOne();
    return {status: 204};
  }
}

