import Router from "Router";
import AuthController from "~/app/http/v1/controllers/AuthController";

/**
 * Endpoints to authenticate users
*/

Router.controller(AuthController).group(() => {
  // Login with various methods
  Router.prefix("/login").group(() => {
    Router.post("/", "login").middleware("limit:2000,2", "recaptcha");
    Router.post("/recovery-code", "loginWithRecoveryCode").middleware("limit:2000,1", "recaptcha");
    // External login provided by Google, Facebook OAuth
    Router.prefix("/external/:provider(google|facebook)").group(() => {
      Router.get("/", "redirectToExternalLoginProvider");
      Router.post("/final-step", "externalLoginFinalStep");
    });
  });
  
  // User password management
  Router.prefix("/password").group(() => {
    Router.post("/forgot", "sendResetPasswordEmail").middleware("recaptcha", "limit:10000,2");
    Router.put("/reset", "resetPassword");
    Router.put("/change", "changePassword").middleware("auth", "verified");
  });

  // Verify user
  Router.prefix("/verify").group(() => {
    Router.get("/:id/:token", "verifyEmail").name("verify");
    Router.post("/resend", "resendEmailVerification").middleware("limit:60000,1");
  });
  
  Router.post("/register", "register").middleware("recaptcha");
  Router.get("/callback/:provider(google|facebook)", "loginWithExternalProvider");
  Router.post("/send-otp/:id", "sendOtp").middleware("limit:60000,3");
  Router.put("/change-phone-number", "changePhoneNumber").middleware("auth", "verified");
  Router.post("/generate-recovery-codes", "generateRecoveryCodes").middleware("limit:60000,3", "auth", "verified");
});
