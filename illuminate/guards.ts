import ShouldQueue from "illuminate/queue/ShouldQueue";

export function isClass(target: any): boolean {
  return typeof target === 'function' && /^\s*class\s+/.test(target.toString());
}

export function isObject(target: any): target is object {
  return typeof target === 'object' && target !== null && !Array.isArray(target);
}

export function isQueueable(target: any): target is ShouldQueue {
  return "queue" in target;
}