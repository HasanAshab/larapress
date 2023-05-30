import { base } from "helpers";
import Wildcard from "illuminate/utils/Wildcard";
import Command from "illuminate/commands/Command";
import fs from "fs";
import path from "path";

export default class Search extends Command {
  public exclude = ["package.json", "package-lock.json", "node_modules", ".git", ".gitignore", ".env", "tsconfig.json", "artisan", "artisan.ts", "dist", "artisan", "backup", "docs", "storage"];

  async handle() {
    this.requiredParams(["query"]);
    const {
      dir = "",
      replace
    } = this.params;
    if(typeof replace !== "undefined") this.info("\nReplacing started...\n");
    else this.info("\nSearching started...\n");

    this._searchFiles(dir).then(() => {
      this.success("done!");
    }).catch((error: any) => {
      throw error
    });
  }

  async _searchFiles(currentDir: string) {
    const files = fs.readdirSync(base(currentDir));
    const promises = [];

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const fullPath = base(filePath);
      const stat = fs.statSync(filePath);
      if (this._isExcluded(fullPath)) continue;
      if (stat.isDirectory()) {
          const promise = this._searchFiles(filePath);
          promises.push(promise);
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { query, replace } = this.params;
        if(Wildcard.match(fileContent, query)){
          if(typeof replace !== "undefined"){
            const replacedContent = Wildcard.replace(fileContent, query, replace);
            const promise = fs.promises.writeFile(base(filePath), replacedContent);
            promises.push(promise);
          }
          this.info(filePath);
        }
      }
    }
    await Promise.all(promises);
  }
  
  _isExcluded(path: string): boolean {
    return this.exclude.map(path => base(path)).includes(path);
  }
}

