import Command from "~/core/abstract/Command";
import DB from "DB";
import User from "~/app/models/User";
import Settings from "~/app/models/Settings";
import componentsPath from "~/core/component/paths";


export default class MakeAdmin extends Command {
  static signature = "create:admin {name?} {username} {email} {password}";
  
  async handle() {
    await DB.connect();
    const admin = await User.create({
      ...this.arguments(),
      role: "admin",
      verified: true,
    });
    await Settings.create({ userId: admin._id })
    this.success("Admin account created successfully!");
  }
}