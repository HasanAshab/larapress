import Command from "illuminate/commands/Command";
import { storage, log } from "helpers";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export default class Clear extends Command {
  uploads() {
    execSync("rm -r storage/public/uploads");
    execSync("mkdir  storage/public/uploads");
    this.success("Uploads are cleared now!");
  }
  
  reports() {
    this.requiredParams(["name"]);
    const { name } = this.params;
    execSync("rm -r storage/reports/" + name);
    execSync("mkdir  storage/reports/" + name);
    this.success(name + " reports are clear now!");
  }
}