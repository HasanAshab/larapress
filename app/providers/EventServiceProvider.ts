import ServiceProvider from "~/core/providers/EventServiceProvider";

export default class EventServiceProvider extends ServiceProvider {
  private events = {
    Registered: [
      "~/app/listeners/CreateUserDefaultSettings",
      "~/app/listeners/SendEmailVerificationNotification",
      "~/app/listeners/SendNewUserJoinedNotificationToAdmins"
    ],
    foo: ["~/app/listeners/Test", "~/app/listeners/Test2"],
  }
}