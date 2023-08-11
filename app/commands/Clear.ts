import Command from "illuminate/commands/Command";
import { storage, log } from "helpers";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export default class Clear extends Command {
  uploads() {
    const directory = storage("public/uploads");
    this.info("Reading directory...");
    this.success("Uploads are cleared now!");
  }
  
  reports() {
    const name = 
    execSync("rm -r storage/reports+name");
    execSync("mkdir  storage/reports");
    this.success("reports are clear now!");
  }
}