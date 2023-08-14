import config from 'config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

throw new Error("Token util is deprecated!")

export default class Token {
  static algorithm = 'aes-256-cbc';

  static keyBuffer(){
    const appKey = config.get("app.key");
    if(typeof appKey === "undefined") throw new Error("APP_KEY is not set.");
    return Buffer.from(appKey, 'hex');
  }
  
  static encode(data: string | object | any[]){
    return Buffer.from(JSON.stringify(data)).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  static decode(encrypted: string){
    return JSON.parse(Buffer.from(encrypted.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  }
  
  static create(key: string, expireAfter?: number) {
    const expiryTime = typeof expireAfter === 'undefined' ? 0: Date.now() + expireAfter;
    const rawData = `${expiryTime}@${key}`;
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.keyBuffer(), iv);
    const encrypted = Buffer.concat([cipher.update(rawData), cipher.final()]);
    return this.encode([encrypted.toString('hex'), iv.toString('hex')]);
  }

  static isValid(key: string, token: string) {
    let encryptedHex: string;
    let ivHex: string;
    try {
      [encryptedHex, ivHex] = this.decode(token);
    } catch (error) {
      return false;
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.keyBuffer(), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString();
    const [expiryTime,
      ...validKey] = decrypted.split('@');
    return validKey.join('') === key && (Number(expiryTime) === 0 || Number(expiryTime) > Date.now());
  }
}