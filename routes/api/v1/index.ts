import Router from "~/core/http/routing/Router";
import MediaController from "~/app/http/controllers/v1/MediaController";

Router.get("/media/:media", MediaController).name("media.serve");