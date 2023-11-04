import { Command } from "samer-artisan";
import { randomBytes, createDecipheriv } from 'crypto';
import fs from 'fs';

export default class DecryptEnv extends Command {
  signature = "env:decrypt {key} {--f|force}";
  description = "Decrypt environment variables";

  async handle() {
    const key = this.argument('key').value;
    const encryptedEnv = fs.readFileSync('.env.encrypted', 'utf-8');
    const parts = encryptedEnv.split(':');
    if (parts.length !== 2)
      this.error("Invalid encrypted environment format.");

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = Buffer.from(parts[1], 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    const decryptedEnv = decipher.update(encryptedData) + decipher.final();

    if(!this.option("force").value && fs.existsSync('.env'))
      this.error(".env file already exist.  (use -f to overwrite)")
    
    fs.writeFileSync('.env', decryptedEnv.toString('utf-8'));

    this.success("Environment variables decrypted and saved to .env");
  }
}
