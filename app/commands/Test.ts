import Command from "~/core/abstract/Command";
import queue from "~/core/clients/queue";
import fs from "fs";
import { log } from "~/core/utils";

export default class Test extends Command {
  signature = "test";
  
  async handle(){
    console.log(this.options)
  }
}