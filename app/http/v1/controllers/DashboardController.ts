import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";
import User from "~/app/models/User";

@controller
export default class DashboardController {
  async admin(req: Request, res: Response) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const [totalUsers, newUsersToday] = await Promise.all([
      User.count({ role: "novice" }),
      User.count({ role: "novice", createdAt: { $gte: today }})
    ]);
    
    res.api({ totalUsers, newUsersToday });
  }
}

