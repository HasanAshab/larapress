import expect from "expect";
import MockDataContainer from "~/tests/MockDataContainer";

export default class Event {
  static mockClear() {
    MockDataContainer.Event = new Map();
  }
  
  static on(event: string | string[], listener: Function) {}
  
  static emit(event: string, data: object) {
    MockDataContainer.Event.set(event, data);
  }
  
  static assertEmitted(event: string, data?: object) {
    if(count) {
      expect(MockDataContainer.Event.get(event)).toEqual(data);
    }
    else expect(MockDataContainer.Event.has(event)).toBe(true);
  }
  
  static assertNothingEmitted(event: string) {
    expect(MockDataContainer.Event.size()).toBe(0);
  }
}

Event.mockClear();

