import { Request } from "express";
import User from "app/models/User";

export default class DashboardController {
  async admin() {
    const totalUsers = await User.count({ role: "novice" });
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const newUsersToday = await User.count({ role: "novice", createdAt: { $gte: today }});
    return { totalUsers, newUsersToday };
  }
}

