import Command from "~/core/abstract/Command";
import { randomBytes, createCipheriv } from 'crypto';
import fs from 'fs';

export default class EncryptEnv extends Command {
  static signature = "env:encrypt {--key=}";
  static description = "Encrypt environment variables";

  handle() {
    const key = this.option('key').value ?? randomBytes(16).toString("hex");
    const envContents = fs.readFileSync('.env', 'utf-8');
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    const encryptedEnv = cipher.update(envContents, 'utf-8', 'hex') + cipher.final('hex');
    fs.writeFileSync('.env.encrypted', iv.toString('hex') + ':' + encryptedEnv, 'utf-8');
    this.info("environment variables encrypted and saved to .env.encrypted...");
    this.success("Key: " + key);
  }
}
