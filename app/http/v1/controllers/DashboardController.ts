import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest, Response } from "~/core/express";
import User from "~/app/models/User";

export default class DashboardController {
  @RequestHandler
  async admin(req: AuthenticRequest, res: Response) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const [totalUsers, newUsersToday] = await Promise.all([
      User.count({ role: "novice" }),
      User.count({ role: "novice", createdAt: { $gte: today }})
    ]);
    res.api({ totalUsers, newUsersToday });
  }
}

