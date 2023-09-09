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

  subCommandRequired(): asserts this is this & { subCommand: string } {
    if (typeof this.subCommand === "undefined") {
      throw new Error("The Sub Command is Required!");
    }
  }

  requiredParams<Keys extends string[]>(requiredParamsName: Keys): asserts this is this & {params: ArrayToParamsObj<Keys>} {
    for (const name of requiredParamsName) {
      if (typeof this.params[name] === "undefined") {
        throw new Error(`The "${name}" Param is Required!`);
      }
    }
  }

  info(text: string) {
    if (this.fromShell) console.log("\x1b[33m", text, "\x1b[0m");
  }

  success(text = "") {
    if (this.fromShell) {
      console.log("\x1b[32m", "\n", text, "\n", "\x1b[0m");
      process.exit(0);
    }
  }

  error(text = "") {
    if (this.fromShell) {
      console.log("\x1b[31m", "\n", text, "\n", "\x1b[0m");
      process.exit(1);
    }
  }
}