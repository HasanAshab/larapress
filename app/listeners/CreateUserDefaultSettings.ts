import { IUser } from "app/models/User";
import Settings from "app/models/Settings";

export default class CreateUserDefaultSettings {
  async dispatch(user: IUser){
    await Settings.create({ userId: user._id });
  }
}