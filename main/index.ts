import "dotenv/config";
import app from "main/app";
import Setup from "main/Setup";
import DB from "illuminate/utils/DB";

const port = Number(process.env.APP_PORT) || 8000;
const connectToDB = process.env.DB_CONNECT || "true";
const nodeEnv = process.env.NODE_ENV;

// Connecting to database
if (connectToDB === "true") {
  console.log("Connecting to database...");
  DB.connect()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.log(err);
  });
}

// Registering all Cron Jobs
Setup.cronJobs();

// Listening for clients
const server = app.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

if (nodeEnv === "development") {
  server.on("connection", (socket) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour12: true
    });
    console.log(`*New connection: [${time}]`);
  });
}

/*
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.APP_SECRET, "hex");
    const iv = crypto.randomBytes(16);
 
function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.APP_SECRET, "hex"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex') };
}
 
var encrypted = encrypt("Hello World!");
 
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
 
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.APP_SECRET, "hex"), iv);
 
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
 
    return decrypted.toString();
}
 
const decrypted = decrypt(encrypted)
console.log("Encrypted Text: " + encrypted.encryptedData); 
console.log("Decrypted Text: " + decrypted); 

*/


import Token from "illuminate/utils/Token";

const t = Token.create("Samer LTD", 100);

console.log(t)

setTimeout(() =>{
console.log(Token.isValid("Samer LTD", "dj"))  
}, 50)
