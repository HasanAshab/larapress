import Command from "~/core/abstract/Command";
import { execSync } from "child_process";

export default class ClearUploads extends Command {
  static signature = "clear:uploads";
  
  handle() {
    execSync("rm -r storage/public/uploads");
    execSync("mkdir  storage/public/uploads");
    this.success("Uploads are cleared now!");
  }
}