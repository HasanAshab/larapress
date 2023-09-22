import { middleware } from "helpers";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import multipartParser from "express-fileupload";
import Setup from "~/main/Setup";
import URL from "URL";

const app: Application = express();

// Securing Application From Potential Attacks
app.use(cors({
// Domains that can only access the API
  origin: [URL.client()] 
}));
app.use(helmet());
app.use("*", middleware("maintenance.check", "limit:1000,2"));

// Setting middlewares for request parsing 
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: "1mb"
}));
app.use(multipartParser());

Setup.bootupServices();

// Registering mongoose global plugins
Setup.mongooseGlobalPlugins();

// Registering global middlewares
app.use(middleware("helpers.inject"));

// Registering all event and listeners
Setup.events(app);

// Registering all group routes 
Setup.routes(app);

// Serving public folder
app.use("/api/files", express.static(__dirname + "/../storage/public"));
 
// Registering global error handling middleware
app.use(middleware("error.handle"));


/*
import { container } from 'tsyringe';
import TestS from "~/app/services/TestS";

function inject(target: any, propertyKey: string, parameterIndex: number) {
  const injectableParamsIndex = Reflect.getMetadata('inject', target, propertyKey) ?? [];
  injectableParamsIndex.push(parameterIndex);
  Reflect.defineMetadata('inject', injectableParamsIndex, target, propertyKey);
}


function Controller(constructor: Function) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype);
  for (const methodName of methodNames) {
    const method = constructor.prototype[methodName];
    if (methodName === "constructor" || typeof method !== "function") continue;
    const paramTypes = Reflect.getMetadata('design:paramtypes', constructor.prototype, methodName);
    const injectableIndexes = Reflect.getMetadata('inject', constructor.prototype, methodName);

    // Cache resolved dependencies
    const resolvedDependencies = injectableIndexes.map((index) => container.resolve(paramTypes[index]));

    constructor.prototype[methodName] = function (...args) {
      for (let i = 0; i < injectableIndexes.length; i++) {
        args[injectableIndexes[i]] = resolvedDependencies[i];
      }
      return method.apply(this, args);
    }
  }
}

@Controller
class Calc {
  add(foo: number, @inject ser: TestS) {
    console.log(foo, ser)
  }
}

new Calc().add(69)
*/
export default app;

