import ServiceProvider from "~/core/abstract/ServiceProvider";

export default class EventServiceProvider extends ServiceProvider {
  private eventsMap = {
    Registered: [
      "CreateUserDefaultSettings",
      "SendEmailVerificationNotification",
      "SendNewUserJoinedNotificationToAdmins"
    ],
    foo: ["Test"],
    //foo2: ["Test2"]
  }
  
  boot() {
    if(this.app.runningInWeb())
      this.subscribeListeners();
  }
  
  private subscribeListeners() {
    for (const [event, listenerNames] of Object.entries(this.eventsMap)) {
      for (const listenerName of listenerNames) {
        const Listener = require(`~/app/listeners/${listenerName}`).default;
        const listenerInstance = new Listener();
        this.app.http.on(event, listenerInstance.dispatch.bind(listenerInstance));
      }
    }
  }
}