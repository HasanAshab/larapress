import Command from "~/core/abstract/Command";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";


export default abstract class ComponentGenerator extends Command {
  abstract protected template(): string;
  abstract protected dist(): string;

  handle() {
    const content = fs.readFileSync(this.getTemplatePath(), "utf-8").replace(/{{name}}/g, this.resolveName());
    const filepath = this.getDistPath();
    this.prepareParentFolders(filepath);
    this.generateComponent(base(filepath), content);
    this.success(`File created successfully: [${filepath}]`);
  }
  
  private resolveName() {
    return this.argument("name").split("/").pop();
  }
  
  private getTemplatePath() {
    return base("core/component/templates", this.template());
  }
  
  private getDistPath() {
    return this.dist().replace(/\{(\w+)\}/g, (match: string, key: string) => {
      return this.argument(key) ?? match;
    });
  }
  
  private prepareParentFolders(filepath: string) {
    execSync("mkdir -p " + path.dirname(filepath));
  }
  
  private generateComponent(dist: string, content: string) {
    try {
      fs.writeFileSync(dist, content, { flag: "wx" });
    } catch {
      this.error("Component already exist!");
    }
  }
}