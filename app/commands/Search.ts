import { base } from 'helpers';
import { replaceWildcard, matchWildcard } from "illuminate/utils";
import Command from 'illuminate/commands/Command';
import fs from 'fs';
import path from 'path';

export default class Search extends Command {
  public exclude = ["node_modules", ".git", ".gitignore", ".env", "tsconfig.js", "dist", "docs", "storage"];

  handle() {
    this.requiredParams(['query']);
    const {
      dir = ''
    } = this.params;
    this.info("\nSearching started...\n");

    this.searchFiles(dir);
    this.success("done!")
  }

  searchFiles(currentDir: string) {
    const files = fs.readdirSync(base(currentDir));
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!this.exclude.includes(file)) this.searchFiles(filePath);
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { query, replace } = this.params;

        if(query.includes("*") && matchWildcard(fileContent, query)){
          if(typeof replace !== "undefined"){
            console.log(replaceWildcard(fileContent, query, replace));
            return;
          }
          else this.info(filePath);
        }
        else if(!query.includes("*") && fileContent.includes(query)){
          if(typeof replace !== "undefined"){
            console.log(fileContent.replaceAll(query, replace));
            return;
          }
          else this.info(filePath);
        }
      }
    }
  };
}