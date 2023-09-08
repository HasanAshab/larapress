import Command from "~/core/abstract/Command";
import { execSync } from "child_process";
import DB from "DB";
import User from "~/app/models/User";
import components from "~/register/components";
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
      role: "admin",
      verified: true,
    });
    this.success("Admin account created successfully!");
  }

  handle() {
    this.subCommandRequired("Material name");
    this.requiredParams(["name"]);
    const fullPath = this.params.name.split("/");
    let content = "";
    const name = fullPath.pop() as string;
    const parentPath = fullPath.join("/");
    let templatePath = `core/templates/${this.subCommand}`;
    const templateDistination = components[this.subCommand];
    if (typeof templateDistination === "object" && fs.statSync(templatePath).isDirectory()){
      templatePath += (typeof this.flags[0] !== "undefined")
        ?'/' + this.flags[0]
        :'/' + templateDistination.default;
    }
    try {
      content = fs.readFileSync(templatePath, "utf-8").replace(/{{name}}/g, name);
    }
    catch {
      this.error("Component not available!");
    }
    
    let pathSchema = components[this.subCommand];
    if(typeof pathSchema === "object"){
      pathSchema = pathSchema[this.flags[0] || pathSchema.default];
    }
    else if(typeof pathSchema === "undefined"){
      this.error("Component not available!");
    }
    const requiredParamNames: string[] = []
    const filepath = pathSchema.replace(/\{(\w+)\}/g, (match: string, key: string) => {
      requiredParamNames.push(key)
      return this.params[key] || match;
    });
    this.requiredParams(requiredParamNames);
    execSync("mkdir -p " + path.dirname(filepath));

    try {
      fs.writeFileSync(filepath, content, {
        flag: "wx"
      });
    } catch {
      this.error("Component already exist!");
    }
    this.success(`File created successfully: [${filepath}]`);
  }


}