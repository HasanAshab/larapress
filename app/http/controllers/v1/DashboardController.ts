import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest } from "~/core/express";
import User from "~/app/models/User";

export default class DashboardController extends Controller {
  @RequestHandler
  async admin(req: AuthenticRequest) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const [totalUsers, newUsersToday] = await Promise.all([
      User.count({ role: "novice" }).lean(),
      User.count({ role: "novice", createdAt: { $gte: today }}).lean()
    ]);
    return { totalUsers, newUsersToday };
  }
}

