import ServiceProvider from "~/core/abstract/ServiceProvider";
import Event from "~/core/Event";

export default class EventServiceProvider extends ServiceProvider {
  private events = {}

  /**
   * Boot event service
  */
  boot() {
    if(this.app.runningInWeb()) {
      this.subscribeListeners();
    }
  }
  
  /**
   * Subscribe all events to global Event Emitter
  */
  private subscribeListeners() {
    for(const eventName in this.events) {
      this.events[eventName].forEach(listenerPath => {
        const Listener = require(listenerPath).default;
        const listener = new Listener();
        Event.on(eventName, listener.dispatch.bind(listener));
      });
    }
  }
}