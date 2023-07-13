export default {
  default: (process.env.CACHE ?? "redis") as typeof list[number],
  list: ["memory", "redis"]
} as const;