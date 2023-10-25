export default {
  google: {
    clientId: env("GOOGLE_CLIENT_ID"),
    clientSecret: env("GOOGLE_CLIENT_SECRET"), 
    redirect: env("GOOGLE_REDIRECT")
  },
  facebook: {
    clientId: env("FACEBOOK_CLIENT_ID"),
    clientSecret: env("FACEBOOK_CLIENT_SECRET"),
    redirect: env("FACEBOOK_REDIRECT")
  }
};
