import {
  base
} from 'helpers';
import Command from 'illuminate/commands/Command';
import fs from 'fs';
import path from 'path';

export default class Search extends Command {
  public exclude = ["node_modules", ".git"];
  
  handle() {
    this.requiredParams(['query']);
    const { dir = '' } = this.params;
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
        if (!this.exclude.includes(file)) this.searchFiles(filePath); // Recursively search subdirectories
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.includes(this.params.query)) {
          this.info(filePath);
        }
      }
    }
  };
}