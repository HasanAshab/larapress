import config from "config";
import URL from "URL"

export default {
  swagger: "2.0",
  info: { title: `${config.get("app.name")} API Docs`, version: "v1" },
  host: URL.resolve(),
  schemes: ["http"],
  basePath: "/",
  paths: {}
};
