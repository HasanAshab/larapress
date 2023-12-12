import ServiceProvider from "~/core/providers/ServiceProvider";
import Event from "./Event";
import type EventsList from "~/app/contracts/events";

export default abstract class EventServiceProvider extends ServiceProvider {
  protected abstract events: Record<keyof EventsList, string | string[]>;

  /**
   * Boot event service
  */
  async boot() {
    if(!this.app.runningInWeb()) return;
    
    const subscribePromises = Object.entries(this.events).map(([eventName, listenerPaths]) => {
      return typeof listenerPaths === "string"
        ? this.subscribeListener(eventName, listenerPaths)
        : listenerPaths.map(path => this.subscribeListener(eventName, path));
    });
    
    await Promise.all(subscribePromises);
  }
  

  private async subscribeListener(event: keyof EventsList, path: string) {
    const Listener = await importDefault(path);
    const listener = new Listener();
    Event.on(event, listener.dispatch.bind(listener));
  }
}