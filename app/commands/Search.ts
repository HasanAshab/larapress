import Wildcard from "Wildcard";
import { Command } from "samer-artisan";
import fs from "fs";
import path from "path";

interface Arguments {
  query: string;
  replace?: string;
}

export default class Search extends Command<Arguments, { dir: string }> {
  signature = "search {query} {replace?} {--D|dir=.}"
  protected exclude = ["package.json", "package-lock.json", "node_modules", ".git", ".gitignore", ".env", "tsconfig.json", "artisan", "artisan.ts", "dist", "artisan", "backup", "docs", "storage"];

  async handle() {
    const { query, replace } = this.arguments();
    if(replace) this.info("\nReplacing started...\n");
    else this.info("\nSearching started...\n");
    await this.searchFiles(this.option("dir"), query, replace);
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
          if(replace){
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

