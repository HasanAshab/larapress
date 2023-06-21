import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from 'crypto';

export default class Token {
  static algorithm = 'aes-256-cbc';

  static create(key: string, expireAfter?: number) {
    const expiryTime = typeof expireAfter === 'undefined' ? 0: Date.now() + expireAfter;
    const rawData = `${expiryTime}@${key}`;
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, Buffer.from(process.env.APP_SECRET!, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(rawData), cipher.final()]);
    const token = JSON.stringify([encrypted.toString('hex'), iv.toString('hex')]);
    return Buffer.from(token).toString('base64');
  }

  static isValid(key: string, token: string) {
    let encryptedHex: string;
    let ivHex: string;
    try {
      [encryptedHex, ivHex] = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    } catch (error) {
      return false;
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv(this.algorithm, Buffer.from(process.env.APP_SECRET!, 'hex'), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString();
    const [expiryTime,
      ...validKey] = decrypted.split('@');
    return validKey.join('') === key && (Number(expiryTime) === 0 || Number(expiryTime) > Date.now());
  }
}