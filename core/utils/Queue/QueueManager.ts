import BullQueue from 'bull';
import Config from "Config";

export default class QueueManager {
  private instances: Record<string, BullQueue> = {};
  
  channel(name: string) {
    if(this.instances[name]) {
      return this.instances[name];
    }
    return this.instances[name] = new BullQueue(name, Config.get("cache.stores.redis.url"), Config.get("queue"));
  }
  
  on(event: string, listener: Function) {
    for(const channel in this.instances) {
      this.instances[channel].on(event, listener);
    }
  }
}