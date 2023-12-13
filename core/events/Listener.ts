import type EventsList from "~/app/contracts/events";

export default interface Listener<Event extends keyof EventsList> {
  dispatch(event: EventsList[Event]): Promise<void> | void;
}