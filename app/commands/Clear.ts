import Command from "illuminate/commands/Command";
import { storage, log } from "helpers";
import fs from 'fs';
import path from 'path';

export default class Clear extends Command {
  description = 'Clear <foo>'

  uploads(): void {
    const directory = storage('public/uploads');
    this.info('Reading directory...');
    fs.readdirSync(directory).forEach((file) => {
      this.info(`removing: ${file}...`);
      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {log(err)});
    });    
    this.success('Uploads are cleared now!');
  }
}