import chalk from 'chalk';

export default abstract class Command {
  static description = "";
  abstract public handle(): void | Promise<void>;

  setup(caller: Function, args = {}, opts = {}, fromShell = true) {
    this.call = caller;
    this.args = args;
    this.opts = opts;
    this.fromShell = fromShell;
  }

  protected arguments() {
    return this.args;
  }
  
  protected argument(key: string) {
    const arg = this.args[key];
    if(typeof arg === "undefined")
      throw new Error(`Argument "${key}" is not registered on signature.`);
    return arg;
  }
  
  protected options() {
    return this.opts;
  }

  protected option(key: string) {
    const option = this.opts[key];
    if(typeof option === "undefined")
      throw new Error(`Option "${key}" is not registered on signature.`);
    return option;
  }
  
  protected info(text: string) {
    if (this.fromShell) console.log("\x1b[33m", text, "\x1b[0m");
  }

  protected success(text?: string) {
    if (this.fromShell) {
      text && console.log("\n", chalk.green(text));
      process.exit(1);
    }
  }

  protected error(text = "") {
    if (this.fromShell) {
      console.log("\x1b[31m", "\n", text, "\n", "\x1b[0m");
      process.exit(0);
    }
  }
}