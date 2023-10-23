import Controller from "~/core/abstract/Controller";
import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest } from "~/core/express";
import User from "~/app/models/User";

export default class DashboardController extends Controller {
  @RequestHandler
  async admin(req: AuthenticRequest) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const [totalUsers, newUsersToday] = await Promise.all([
      User.count({ role: "novice" }),
      User.count({ role: "novice", createdAt: { $gte: today }})
    ]);
    return { totalUsers, newUsersToday };
  }
}

