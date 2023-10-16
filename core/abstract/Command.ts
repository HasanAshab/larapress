import { ArrayToParamsObj } from "types";

export default abstract class Command {
  constructor(
    public subCommand?: string,
    public fromShell: boolean = true,
    public flags: string[] = [],
    public params: Record<string, string> = {}
  ) {
    this.subCommand = subCommand;
    this.fromShell = fromShell;
    this.flags = flags;
    this.params = params;
  }

  protected subCommandRequired(): asserts this is this & { subCommand: string } {
    if (typeof this.subCommand === "undefined") {
      throw new Error("The Sub Command is Required!");
    }
  }

  protected requiredParams<Keys extends string[]>(requiredParamsName: Keys): asserts this is this & {params: ArrayToParamsObj<Keys>} {
    for (const name of requiredParamsName) {
      if (typeof this.params[name] === "undefined") {
        throw new Error(`The "${name}" Param is Required!`);
      }
    }
  }

  protected info(text: string) {
    if (this.fromShell) console.log("\x1b[33m", text, "\x1b[0m");
  }

  protected success(text = "") {
    if (this.fromShell) {
      console.log("\x1b[32m", "\n", text, "\n", "\x1b[0m");
      process.emit("taskDone");
    }
  }

  protected error(text = "") {
    if (this.fromShell) {
      console.log("\x1b[31m", "\n", text, "\n", "\x1b[0m");
      process.emit("taskDone");
    }
  }
}
