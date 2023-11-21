import { UserDocument } from "~/app/models/User";

interface Registered {
  user: UserDocument;
  version: string;
  method: "internal" | "social";
}

export default class SendEmailVerificationNotification {
  async dispatch({ user, version, method}: Registered) {
    if(method === "internal") {
      await user.sendVerificationNotification(version);
    }
  }
}