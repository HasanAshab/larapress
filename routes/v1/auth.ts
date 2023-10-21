import Router from "Router";
import AuthController from "~/app/http/v1/controllers/AuthController";

/**
 * Endpoints to authenticate users
*/
Router.controller(AuthController).group(() => {
  Router.post("/register", "register").middleware("recaptcha").name("register");
  Router.post("/login", "login").middleware("limit:2000,2", "recaptcha").name("login");
});
