import { base } from 'helpers';
import { replaceWildcard, matchWildcard } from "illuminate/utils";
import Command from 'illuminate/commands/Command';
import fs from 'fs';
import path from 'path';

export default class Search extends Command {
  public exclude = ["node_modules", ".git", ".gitignore", ".env", "tsconfig.js", "docs", "storage"];

  async handle() {
    this.requiredParams(['query']);
    const {
      dir = '',
      replace
    } = this.params;
    if(typeof replace !== "undefined") this.info("\nReplacing started...\n");
    else this.info("\nSearching started...\n");

    const searchPromise = this.searchFiles(dir);
    searchPromise.then(() => {
      this.success("done!");
    }).catch((error: any) => {
      throw error
    });
  }

  async searchFiles(currentDir: string) {
    const files = fs.readdirSync(base(currentDir));
    const promises = [];

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!this.exclude.includes(file)) {
          const promise = this.searchFiles(filePath);
          promises.push(promise);
        }
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { query, replace } = this.params;

        if(matchWildcard(fileContent, query)){
          if(typeof replace !== "undefined"){
            const replacedContent = replaceWildcard(fileContent, query, replace);
            const promise = fs.promises.writeFile(base(filePath), replacedContent);
            promises.push(promise);
          }
          this.info(filePath);
        }
      }
    }

    await Promise.all(promises);
  }
}
