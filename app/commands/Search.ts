import Wildcard from "Wildcard";
import Command from "~/illuminate/commands/Command";
import fs from "fs";
import path from "path";

export default class Search extends Command {
  public exclude = ["package.json", "package-lock.json", "node_modules", ".git", ".gitignore", ".env", "tsconfig.json", "artisan", "artisan.ts", "dist", "artisan", "backup", "docs", "storage"];

  async handle() {
    this.requiredParams(["query"]);
    const {
      query,
      replace = undefined,
      dir = "."
    } = this.params;
    if(typeof replace !== "undefined") this.info("\nReplacing started...\n");
    else this.info("\nSearching started...\n");

    this.searchFiles(dir, query, replace).then(() => {
      this.success("done!");
    }).catch((error: any) => {
      throw error
    });
  }

  private async searchFiles(currentDir: string, query: string, replace?: string) {
    const files = fs.readdirSync(currentDir);
    const promises = [];

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const fullPath = filePath;
      const stat = fs.statSync(filePath);
      if (this.isExcluded(fullPath)) continue;
      if (stat.isDirectory()) {
          const promise = this.searchFiles(filePath, query, replace);
          promises.push(promise);
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        if(Wildcard.match(fileContent, query)){
          if(typeof replace !== "undefined"){
            const replacedContent = Wildcard.replace(fileContent, query, replace);
            const promise = fs.promises.writeFile(filePath, replacedContent);
            promises.push(promise);
          }
          this.info(filePath);
        }
      }
    }
    await Promise.all(promises);
  }
  
  private isExcluded(path: string): boolean {
    return this.exclude.includes(path);
  }
}

