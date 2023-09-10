import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import { IUser } from "~/app/models/User";
import Settings from "~/app/models/Settings";
import Role from "~/app/models/Role";

export default class UserFactory extends Factory {
  definition() {
    return {
      username: faker.person.firstName(),
      email: faker.internet.email(),
      phoneNumber: "+15005550006",
      password: "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi", // "password"
      verified: true
    };
  }
  
  unverified() {
    return this.on("made", user => {
      user.verified = false;
    });
  }
  
  oauth() {
    return this.on("made", user => {
      delete user.password;
    });
  }
  
  withRole(name: string) {
    return this.on("made", user => {
      user.role = name;
    });
  }
  
  hasSettings(mfa = false) {
    return this.on("created", async (users: IUser[]) => {
      const settingsData: any[] = [];
      for(const user of users){
        settingsData.push({
          userId: user._id,
          twoFactorAuth: { 
            enabled: mfa
          }
        });
      }
      await Settings.insertMany(settingsData);
    });
  }
}