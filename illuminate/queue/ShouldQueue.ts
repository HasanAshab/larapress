import { Queue } from "bull";

export default interface ShouldQueue {
  shouldQueue: boolean;
  queue: Queue;
  setQueue: (name?: string) => void;
}