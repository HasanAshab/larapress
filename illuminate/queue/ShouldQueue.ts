import { Queue } from "bull";

export default interface ShouldQueue {
  shouldQueue: boolean;
  createQueue: (name?: string) => Queue;
}