import { Queue } from "bull";

export default interface ShouldQueue {
  queueChannel: string;
}