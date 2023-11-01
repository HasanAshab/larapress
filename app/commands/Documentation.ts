import Command from "~/core/abstract/Command";
import baseDoc from "~/docs/base";
import fs from "fs";
import { Request, AuthenticRequest } from "~/core/express";
import RouteServiceProvider from "~/app/providers/RouteServiceProvider";
import Router from "Router";

export default class Documentation extends Command {
  static signature = "doc:generate";
  
  handle() {
    new RouteServiceProvider({} as any).registerRoutes();
    const docData = this.generateDocData();
    fs.writeFileSync(base("docs/data.json"), JSON.stringify(docData));
    this.success()
  }
  
  
  private generateDocData() {
    for(const stack of Router.$stack) {
      const subDoc = { parameters: [] };
      const [ Controller, action ] = stack.metadata;
      const paramTypes = Reflect.getMetadata("design:paramtypes", Controller.prototype, action);
      const CustomRequest = paramTypes.find(paramType => paramType.prototype instanceof Request)
      if(stack.middlewares.includes("auth")) {
        const parameter = {
          required: true,
          in: "header",
          name: "Authorization",
          type: "string",
          format: "bearer",
        };
        const roles = stack.middlewares.find(alias => alias.startsWith("roles:"))?.split(":")[1];
        if(roles) {
          parameter.description = "Bearer token of role: " + roles;
        }
        subDoc.parameters.push(parameter);
      }
      if(CustomRequest?.rules) {
        const rules = CustomRequest.rules();
        for(const name in rules) {
          subDoc.parameters.push({
            name,
            in: "body",
            type: rules[name].type,
            required: rules[name]._flags?.presence === "required",
          });
        }
      }   

      if(baseDoc.paths[stack.path])
        baseDoc.paths[stack.path][stack.method] = subDoc;
      else 
        baseDoc.paths[stack.path] = { [stack.method]: subDoc };
    }
    return baseDoc;
  }
}