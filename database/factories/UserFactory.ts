import Factory from "~/core/database/Factory";
import { IUser, UserDocument } from "~/app/models/User";
import Settings from "~/app/models/Settings";

export default class UserFactory extends Factory<IUser, UserDocument> {
  definition() {
    return {
      name: this.faker.person.firstName(),
      username: this.faker.person.firstName(),
      email: this.faker.internet.email(),
      phoneNumber: null,
      password: "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi", // "password"
      verified: true,
      role: "novice" as const,
      profile: null,
      recoveryCodes: [],
      externalId: {}
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
      user.password = null;
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
    return this.external(async (users: UserDocument[]) => {
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
  
  withProfile(url = this.faker.internet.avatar()) {
    return this.state((user: IUser) => {
      user.profile = url;
      return user;
    });
  }
  
  withPhoneNumber(phoneNumber = "+15005550006") {
    return this.state((user: IUser) => {
      user.phoneNumber = phoneNumber;
      return user;
    });
  }
}