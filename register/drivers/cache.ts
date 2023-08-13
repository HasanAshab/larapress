import config from "config";

export default {
  default: config.get("cache") as any,
  list: ["memory", "redis"]
} as const;

