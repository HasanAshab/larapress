import { Command } from "samer-artisan";
import queue from "~/core/clients/queue";
import fs from "fs";

export default class Test extends Command {
  signature = "test {a} {--B|ball} {--cks}";

  async handle(){
    console.log(this.arguments())
    console.log(this.options())
    this.success("Done")
  }
}