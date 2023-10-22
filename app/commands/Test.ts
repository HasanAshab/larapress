import Command from "~/core/abstract/Command";
import queue from "~/core/clients/queue";
import fs from "fs";

export default class Test extends Command {
  static signature = "test {a} {--B|ball} {--cks}";
  static bootApp = true;
  
  async handle(){
    console.log(this.arguments())
    console.log(this.options())
    this.success("Done")
  }
}