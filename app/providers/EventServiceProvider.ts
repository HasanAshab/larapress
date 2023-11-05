import ServiceProvider from "~/core/providers/EventServiceProvider";

export default class EventServiceProvider extends ServiceProvider {
  /**
  * Register Events and its listeners path
  */
  private events: Record<string, string | string[]> = {
    Registered: [
      "~/app/listeners/SendEmailVerificationNotification",
      "~/app/listeners/SendNewUserJoinedNotificationToAdmins"
    ],
  }
}