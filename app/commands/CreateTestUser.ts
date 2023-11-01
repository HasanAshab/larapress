import Command from "~/core/abstract/Command";
import DB from "DB";
import User from "~/app/models/User";

export default class CreateTestUser extends Command {
  static signature = "create:user";
  static description = "Creates a user for testing purpose";

  async handle(){
    await DB.connect();
    const user = await User.factory().create();
    const token = user.createToken();
    this.info("User data: ")
    console.log(user)
    this.success("Token: " + token);
  }
}