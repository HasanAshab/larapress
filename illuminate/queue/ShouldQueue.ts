import { Queue } from "bull";

export default interface ShouldQueue {
  public shouldQueue: boolean;
  public queue: Queue;
  public setQueue(name?: string): void;
}