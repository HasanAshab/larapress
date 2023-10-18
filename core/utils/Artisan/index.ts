import BaseCommand from "~/core/abstract/Command";
import ArgumentParser from "./ArgumentParser";
import path from "path";
import fs from "fs";

export default class Artisan {
  static _map = {};
  
  static parseSignature(signature: string) {
    const spaceIndex = signature.indexOf(' ');
    if (spaceIndex === -1)
      return [signature, ""];
    const base = signature.substring(0, spaceIndex);
    const pattern = signature.substring(spaceIndex + 1);
    return [base, pattern];
  }

  static add(Command) {
    const command = new Command();
    const [ base, pattern ] = this.parseSignature(command.signature);
    this._map[base] = [command, pattern];
  }
  
  static load(dir: string) {
    fs.readdirSync(dir).forEach(fileName => {
      const Command = require(base(dir, fileName)).default;
      if(Command.prototype instanceof BaseCommand)
        this.add(Command);
    });
  }
  
  static async call(base: string, input: string[]) {
    console.log(this._map)
    const [ command, pattern ] = this._map[base];
    const { args, opts } = ArgumentParser(pattern, input);
    command.setup(args, opts, env("NODE_ENV") === "shell");
    await command.handle();
  }
}