import Router from "Router";
import SettingsController from "~/app/http/v1/controllers/SettingsController";


Router.controller(SettingsController).group(() => {
  // User settings managenent
  Router.middleware(["auth", "verified"]).group(() => {
    Router.get("/", "index");
    Router.post("/setup-2fa", "setupTwoFactorAuth");
    Router.put("/notification", "notification");
  });

  // App settings managenent
  Router.middleware(["auth", "roles:admin"]).group(() => {
    Router.get("/app", "getAppSettings");
    Router.put("/app", "updateAppSettings");
  });
});