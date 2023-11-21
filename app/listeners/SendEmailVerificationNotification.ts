import type EventsList from "~/app/contracts/events";

export default class SendEmailVerificationNotification {
  async dispatch(event: EventsList["Registered"]) {
    if(event.method === "internal") {
      await event.user.sendVerificationNotification(event.version);
    }
  }
}