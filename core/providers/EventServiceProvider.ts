import ServiceProvider from "~/core/abstract/ServiceProvider";

export default class EventServiceProvider extends ServiceProvider {
  private events = {}

  boot() {
    if(this.app.runningInWeb()) {
      this.subscribeListeners();
    }
  }
  
  private subscribeListeners() {
    for(const eventName in this.events) {
      this.events[eventName].forEach(listenerPath => {
        const Listener = require(listenerPath).default;
        const listener = new Listener();
        this.app.on(eventName, listener.dispatch.bind(listener));
      });
    }
  }
}