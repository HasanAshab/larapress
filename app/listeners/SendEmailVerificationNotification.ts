import type Listener from "~/core/events/Listener";
import type EventsList from "~/app/contracts/events";

export default class SendEmailVerificationNotification implements Listener<"Registered"> {
  async dispatch(event: EventsList["Registered"]) {
    if(event.method === "internal") {
      await event.user.sendVerificationNotification(event.version);
    }
  }
}