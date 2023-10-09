import { middleware } from "~/core/utils";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import Setup from "~/main/Setup";
import URL from "URL";

const app: Application = express();

// Securing App
app.use(cors({
// Domains that can only access the API
  origin: [URL.client()] 
}));
app.use(helmet());

// Middlewares for request payload parsing 
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: "1mb"
}));
app.use(formDataParser());

// Bootstrap the App
Setup.bootstrap(app);

import config from "config";
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { OAuth2Strategy } from 'passport-google-oauth';
import User from "~/app/models/User";


app.use(passport.initialize());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('app.key'),
  issuer: config.get('app.name'),
  audience: config.get('app.name')
};


passport.use(new Strategy(jwtOptions, async function(payload, next){
  try {
    const user = await User.findById(payload.sub);
    if (user && user.tokenVersion === payload.version) {
      return next(null, user, payload);
    }
    return next();
  }
  catch(err) {
    log(err)
    next();
  }
}));
/*
passport.use(new OAuth2Strategy(config.get("socialite.google"), async function (request, accessToken, refreshToken, profile, done) {
  const { sub, email, picture } = profile._json;
  const user = await User.findOneAndUpdate(
    { "externalId.google": sub },
    { 
      email,
      verified: true,
      "logo.url": picture
    },
    { upsert: true, new: true }
  );
  return done(null, user);
}));
*/
export default app;

