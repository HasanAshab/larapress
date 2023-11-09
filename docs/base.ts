import Config from "Config";
import URL from "URL"

export default {
  swagger: "2.0",
  info: { 
    title: `${Config.get("app.name")} API Docs`,
    version: "v1"
  },
  host: URL.resolve(),
  schemes: ["http"],
  basePath: "/",
  paths: {} as Record<string, Record<string, any>>
};