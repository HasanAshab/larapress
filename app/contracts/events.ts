import type { UserDocument } from "~/app/models/User";

export default interface EventsList {
  "Registered": {
    user: UserDocument;
    version: string;
    method: "internal" | "social";
  }
}