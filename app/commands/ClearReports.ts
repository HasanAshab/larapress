import Command from "~/core/abstract/Command";
import { execSync } from "child_process";

export default class ClearReports extends Command {
  signature = "clear:reports {name}";
  
  handle() {
    const name = this.argument("name");
    execSync("rm -r storage/reports/" + name);
    execSync("mkdir  storage/reports/" + name);
    this.success(name + " reports are clear now!");
  }
}