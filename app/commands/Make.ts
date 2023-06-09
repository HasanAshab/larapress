import {
  base
} from "helpers";
import { loadDir } from "illuminate/utils";
import Command from "illuminate/commands/Command";
import DB from "illuminate/utils/DB";
import User from "app/models/User";
import components from "register/components";
import fs from "fs";
import path from "path";


export default class Make extends Command {

  async admin() {
    this.requiredParams(["name", "email", "password"]);
    const {
      name,
      email,
      password
    } = this.params;
    await DB.connect();
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true,
      emailVerified: true,
    });
    this.success("Admin account created successfully!");
  }

  handle() {
    this.subCommandRequired("Material name");
    this.requiredParams(["name"]);
    const fullPath = this.params.name.split("/");
    const name = fullPath.pop() as string;
    const parentPath = fullPath.join("/");
    const content = this._getTemplate(this.subCommand, name);
    const filepath = this._getPath(this.subCommand, parentPath, name);
    try {
      fs.writeFileSync(base(filepath), content, {
        flag: "wx"
      });
    } catch {
      this.error("Component already exist!");
    }
    this.success(`File created successfully: [${filepath}]`);
  }

  _getTemplate(componentName: string, name: string): string {
    let path = base(`illuminate/templates/${componentName}`);
    const templateDistination = components[componentName];
    if (typeof templateDistination !== "string"){
      path += (this.flags.length > 0)
        ?'/' + this.flags[0]
        :'/' + templateDistination.default;
    }
    try {
      return fs.readFileSync(path, "utf-8").replace(/{{name}}/g, name);
    }
    catch {
      this.error("Component not found!");
      return "";
    }
  }

  _getPath(componentName: string, parentPath: string, name: string): string {
    let pathSchema = components[componentName];
    if(typeof pathSchema === "object"){
      pathSchema = pathSchema[this.flags[0] || pathSchema.default];
    }
    else if(typeof pathSchema === "undefined"){
      this.error("Component not available");
      return "";
    }

    const componentPath = pathSchema.replace(/{{name}}/g, path.join(parentPath, name))
    loadDir(path.dirname(componentPath));
    return componentPath;
  }
}