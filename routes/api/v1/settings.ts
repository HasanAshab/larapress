import Router from "~/core/http/routing/Router";
import SettingsController from "~/app/http/controllers/v1/SettingsController";


Router.controller(SettingsController).group(() => {
  // User settings managenent
  Router.middleware(["auth", "verified"]).group(() => {
    Router.get("/", "index");
    Router.post("/setup-2fa", "setupTwoFactorAuth");
    Router.patch("/notification", "setupNotificationPreference");
  });

  // App settings managenent
  Router.middleware(["auth", "roles:admin"]).group(() => {
    Router.get("/app", "getAppSettings");
    Router.patch("/app", "updateAppSettings");
  });
});