export default {
  default: (process.env.CACHE ?? "redis") as any,
  list: ["memory", "redis"]
} as const;

