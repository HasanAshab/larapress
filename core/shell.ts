import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
import "~/vendor/autoload";
import Application from "~/core/Application";
import Artisan from 'Artisan';

const app = new Application();

app.bootstrap().then(() => {
  const [baseInput, ...args] = process.argv.splice(2);
  Artisan.call(baseInput, args);
});

/*
import { execSync } from "child_process";
import fs from "fs";

console.time("CP");
console.log(execSync(`ls`).toString().split("\n"))
console.timeEnd("CP");

console.time("FS");
console.log(fs.readdirSync('.'))
console.timeEnd("FS");
*/