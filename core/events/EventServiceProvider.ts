import ServiceProvider from "~/core/providers/ServiceProvider";
import Event from "./Event";

export default abstract class EventServiceProvider extends ServiceProvider {
  protected abstract events: Record<string, string | string[]>;

  /**
   * Boot event service
  */
  async boot() {
    if(!this.app.runningInWeb()) return;
    
    await this.events.entries().map(([eventName, listenerPaths]) => {
      return typeof listenerPaths === "string"
        ? this.subscribeListener(eventName, listenerPaths)
        : listenerPaths.map(path => this.subscribeListener(eventName, path));
    });
  }
  

  private async subscribeListener(event: string, path: string) {
    const { default: Listener } = await import(path);
    const listener = new Listener();
    Event.on(event, listener.dispatch.bind(listener));
  }
}