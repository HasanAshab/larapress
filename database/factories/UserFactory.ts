import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import { IUser } from "~/app/models/User";
import Settings from "~/app/models/Settings";

export default class UserFactory extends Factory {
  configure() {
    this.on("created", async (users: IUser) => {
      const settingsData: any[] = [];
      for(const user of users){
        settingsData.push({
          userId: user._id,
          twoFactorAuth: { 
            enabled: this.options.mfa
          }
        });
      }
      await Settings.insertMany(settingsData);
    });
  }
  
  definition() {
    return {
      username: faker.person.firstName(),
      email: faker.internet.email(),
      phoneNumber: "+15005550006",
      password: "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi", // "password"
      verified: true
    };
  }
  
  admin() {
    return this.state(fields => {
      fields.role = "admin";
    });
  }
  
  unverified() {
    return this.state(fields => {
      fields.verified = false;
    });
  }
}