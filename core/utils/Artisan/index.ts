import BaseCommand from "~/core/abstract/Command";
import ArgumentParser from "./ArgumentParser";
import path from "path";
import fs from "fs";
import commandMap from "~/storage/cache/artisan";

export default class Artisan {
  static $loadFrom: string[] = [];
  static $cacheDist = base("storage/cache/artisan.json");

  static parseSignature(signature: string) {
    const spaceIndex = signature.indexOf(' ');
    if (spaceIndex === -1)
      return [signature, ""];
    const base = signature.substring(0, spaceIndex);
    const pattern = signature.substring(spaceIndex + 1);
    return [base, pattern];
  }


  static load(dir: string) {
    this.$loadFrom.push(dir);
  }
  
  static async call(base: string, input: string[] = []) {
    if(base === "list") {
      this.showCommandList();
      process.exit(0);
    }
    else if(base === "cache") {
      this.cacheCommandsMap();
      process.exit(0);
    }
    
    const commandMeta = commandMap[base];
    if(!commandMeta)
      throw new Error(`Command "${base}" not registered.`);
    const [ path, pattern ] = commandMeta;
    const { args, opts } = ArgumentParser(pattern, input);
    const Command = require(path).default;
    const command = new Command();
    command.setup(this.call, args, opts, env("NODE_ENV") === "shell");
    await command.handle();
  }

  static showCommandList() {
    console.log("Available Commands: \n\n")
    for(const key in commandMap) {
      console.log(key, "\t\t")
    }
  }
  
  static cacheCommandsMap() {
    const map = {};
    this.$loadFrom.forEach(dir => {
      fs.readdirSync(base(dir)).forEach(fileName => {
        const fullPath = base(dir, fileName);
        const Command = require(fullPath).default;
        if(typeof Command === "function" && Command.prototype instanceof BaseCommand) {
          if(!Command.signature)
            throw new Error(`Signature required in command: "${path.join(dir, fileName)}"`);
          const [ base, pattern ] = this.parseSignature(Command.signature);
          map[base] = [fullPath, pattern, Command.description];
        }
      });
    });
    fs.writeFileSync(this.$cacheDist, JSON.stringify(map));
  }
  
}