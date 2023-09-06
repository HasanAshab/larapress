import Factory from "~/core/factories/Factory";
import { IUser } from "~/app/models/User";
import Settings from "~/app/models/Settings";

export default class UserFactory extends Factory {
  public config = {
    events: false
  };
  
  definition() {
    return {
      username: this.faker.person.firstName(),
      email: this.faker.internet.email(),
      phoneNumber: "+15005550006",
      password: "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi", // "password"
      verified: true
    };
  }
  
  async post(users: IUser[]){
    const settingsData: any[] = [];
    for(const user of users){
      settingsData.push({
        userId: user._id,
        twoFactorAuth: { 
          enabled: this.config.mfa
        }
      });
    }
    await Settings.insertMany(settingsData);
  }
}