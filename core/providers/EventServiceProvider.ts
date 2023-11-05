import ServiceProvider from "~/core/abstract/ServiceProvider";
import Event from "~/core/Event";

export default abstract class EventServiceProvider extends ServiceProvider {
  protected abstract events: Record<string, string | string[]>;

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
      const listenerPaths = this.events[eventName];
      if(typeof listenerPaths === "string")
        this.subscribeListener(eventName, listenerPaths)
      else listenerPaths.forEach(path => this.subscribeListener(eventName, path));
    }
  }
  
  private subscribeListener(event: string, path: string) {
    const Listener = require(path).default;
    const listener = new Listener();
    Event.on(event, listener.dispatch.bind(listener));
  }
}