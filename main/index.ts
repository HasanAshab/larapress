import "reflect-metadata";
import "dotenv/config";
(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest")
  && require('module-alias/register');
import config from 'config';
import app from "~/main/app";
import Setup from "~/main/Setup";
import DB from "DB";
import Mail from "Mail";
process.env.NODE_ENV === "loadTest" && (Mail as any).mock();
import https from "https";
import fs from "fs";

const log = process.env.NODE_ENV === "development";

// Connect to database
if (false && config.get("db.connect")) {
  log && console.log("Connecting to database...");
  DB.connect().then(async () => {
    log && console.log("DB connected!");
    Setup.mongooseModels();
  });
}

// Registering Cron Jobs
Setup.cronJobs();

let server;
const loadBalancerConfig = config.get<any>("loadBalancer");
if(loadBalancerConfig.enabled) {
  console.log(`load Balancer: [http://127.0.0.1:${config.get("app.port")}]\n`)
  console.log("Server Instances:")
  for (const port of loadBalancerConfig.ports) {
    app.listen(port, () => {
      console.log(`[http://127.0.0.1:${port}]`);
    }).on("connection", (socket) => {
      const time = new Date().toLocaleTimeString("en-US", { hour12: true });
      log && console.log(`*New connection on port ${port} [${time}]`);
    });
  }
}

else {
  const port = config.get<number>("app.port");
  server = app.listen(port, () => {
    process.env.NODE_ENV !== "test" && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  
  log && server.on("connection", (socket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}

import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";
import { AuthenticRequest, Response } from "~/core/express";
import RequestHandler from "~/core/decorators/RequestHandler";

class LoginRequest extends AuthenticRequest {
  body!: { 
    email: string;
    password: string;
    otp: number;
  };
  
  protected rules() {
    return {
      email: Validator.string().email().required(),
      password: Validator.string().required(),
      otp: Validator.number(),
      logo: Validator.file()
    }
  }
}
/*
class JustNothing {
  @RequestHandler
  ehhe(res: Response, req: LoginRequest, service: TwoFactorAuthService, bar = "jd") {
    console.log(req, res, service, bar)
  }
}

const req: any = {body: {foo: 93}, params: {bar:82}}
new JustNothing().ehhe(req, {}, console.log)
*/


import Joi from "joi";
import Validator from "Validator";

const schema = Validator.object({
  email: Validator.file().max(1000).min(200).parts(1).required(),
  password: Validator.string().required(),
  otp: Validator.number(),
})

const req = {
  files:   {
  email: {
      name: `dummy1.jpg`,
      data: Buffer.from("dummy file content"),
      size: 500,
      encoding: "utf-8",
      mimetype: "image/jpeg",
    }
    
},
  body: {
    password: "barj",
  }
}

const result = schema.validate(Object.assign({}, req.files, req.body));

console.log(result)
//console.log(result.error.details)

export default server;