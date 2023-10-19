import Command from "~/core/abstract/Command";
import { execSync } from "child_process";
import componentsPath from "~/core/component/paths";
import fs from "fs";
import path from "path";


export default class Make extends Command {
  signature = "make:model {name}";

  protected makes = "model";
  
  handle() {
    this.component("model").replacers(this.arguments()).create();
    /*
    const fullPath = this.arguments("name").split("/");
    let content = "";
    const name = fullPath.pop() as string;
    const parentPath = fullPath.join("/");

    let templatePath = `core/component/templates/${componentName}`;
    const templateDistination = componentsPath[componentName];
    if (typeof templateDistination === "object" && fs.statSync(templatePath).isDirectory()){
      templatePath += (typeof this.flags[0] !== "undefined")
        ?'/' + this.flags[0]
        :'/' + templateDistination.default;
    }
    const content = fs.readFileSync(templatePath, "utf-8").replace(/{{name}}/g, name);

    let pathSchema = componentsPath[componentName];
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
  */
  }

}