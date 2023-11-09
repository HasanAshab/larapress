import { Command } from "samer-artisan";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";


export default abstract class ComponentGenerator<Options = {}> extends Command<{ name: string }, Options> {
  protected abstract template(): string;
  protected abstract dist(): string;

  handle() {
    const content = fs.readFileSync(this.templatePath, "utf-8").replace(/{{name}}/g, this.resolvedName());
    const filepath = base(this.dist());
    this.prepareParentFolders(filepath);
    this.generateComponent(filepath, content);
    this.info(`File created successfully: [${filepath}]`);
  }
  
  private resolvedName() {
    return this.argument("name").split("/").pop()!;
  }
  
  private get templatePath() {
    return base("core/component/templates", this.template());
  }
  

  private prepareParentFolders(filepath: string) {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
  }
  
  private generateComponent(dist: string, content: string) {
    try {
      fs.writeFileSync(dist, content, { flag: "wx" });
    } catch {
      this.fail("Component already exist!");
    }
  }
}