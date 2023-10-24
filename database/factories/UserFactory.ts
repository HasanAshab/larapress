import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import { IUser } from "~/app/models/User";
import Settings from "~/app/models/Settings";

export default class UserFactory extends Factory {
  definition() {
    return {
      name: faker.person.firstName(),
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi", // "password"
      verified: true
    };
  }
  
  unverified() {
    return this.state((user: IUser) => {
      user.verified = false;
      return user;
    });
  }
  
  oauth() {
    return this.state((user: IUser) => {
      delete user.password;
      return user;
    });
  }
  
  withRole(name: IUser["role"]) {
    return this.state((user: IUser) => {
      user.role = name;
      return user;
    });
  }
  
  hasSettings(mfa = false) {
    return this.external(async (users: IUser[]) => {
      const settingsData: any[] = [];
      for(const user of users){
        settingsData.push({
          userId: user._id,
          "twoFactorAuth.enabled": mfa
        });
      }
      await Settings.insertMany(settingsData);
    });
  }
  
  withPhoneNumber(phoneNumber = "+15005550006") {
    return this.state((user: IUser) => {
      user.phoneNumber = phoneNumber;
      return user;
    });
  }
}