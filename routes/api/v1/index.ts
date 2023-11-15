import Router from "Router";
import MediaController from "~/app/http/controllers/v1/MediaController";

Router.get("/media/:media", [MediaController, "index"]).name("media.serve");
