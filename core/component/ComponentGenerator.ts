import Command from "~/core/abstract/Command";
import { execSync } from "child_process";
import componentsPath from "~/core/component/paths";
import fs from "fs";
import path from "path";


export default abstract class ComponentGenerator extends Command {
  abstract protected template(): string;
  abstract protected path(): string;
  
  handle() {
    const content = fs.readFileSync(this.getTemplatePath(), "utf-8").replace(/{{name}}/g, this.resolveName());
    const filepath = this.getDistPath();
    this.prepareParentFolders(filepath);
    try {
      fs.writeFileSync(base(filepath), content, { flag: "wx" });
    } catch {
      this.error("Component already exist!");
    }
    this.success(`File created successfully: [${filepath}]`);
  }
  
  private resolveName() {
    const fullPath = this.argument("name").split("/");
    let content = "";
    return fullPath.pop();
  }
  
  private getTemplatePath() {
    return base("core/component/templates", this.template());
  }
  
  private getDistPath() {
    const schema = componentsPath[this.path()]
    return schema.replace(/\{(\w+)\}/g, (match: string, key: string) => {
      return this.argument(key) ?? match;
    });
  }
  
  private prepareParentFolders(filepath: string) {
    execSync("mkdir -p " + path.dirname(filepath));
  }
}