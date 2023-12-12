import Router from "~/core/http/routing/Router";
import AuthController from "~/app/http/controllers/v1/AuthController";

/**
 * Endpoints to authenticate users
*/

await Router.controller(AuthController).group(async () => {
  // Login with various methods
  await Router.prefix("/login").group(async () => {
    Router.post("/", "login").middleware("limit:2000,2", "recaptcha");
    Router.post("/recovery-code", "loginWithRecoveryCode").middleware("limit:2000,1", "recaptcha");
    
    // Social login provided by Google, Facebook OAuth
    await Router.prefix("/social/:provider(google|facebook)").group(() => {
      Router.get("/", "redirectToSocialLoginProvider");
      Router.post("/final-step", "socialLoginFinalStep");
    });
  });
  
  // User password management
  await Router.prefix("/password").group(() => {
    Router.post("/forgot", "forgotPassword").middleware("recaptcha", "limit:10000,2");
    Router.patch("/reset", "resetPassword");
    Router.patch("/change", "changePassword").middleware("auth", "verified");
  });

  // Verify user
  await Router.prefix("/verify").group(() => {
    Router.get("/:id/:token", "verifyEmail").name("verify");
    Router.post("/resend", "resendEmailVerification").middleware("limit:60000,1");
  });
  
  Router.post("/register", "register").middleware("recaptcha");
  Router.get("social/callback/:provider(google|facebook)", "loginWithSocialProvider");
  Router.post("/send-otp/:user", "sendOtp").middleware("limit:60000,3");
  Router.patch("/change-phone-number", "changePhoneNumber").middleware("auth", "verified");
  Router.post("/generate-recovery-codes", "generateRecoveryCodes").middleware("limit:60000,3", "auth", "verified");
});