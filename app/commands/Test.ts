import Command from "~/illuminate/commands/Command";

export default class Test extends Command {
  async handle(){
    console.log(this.params)
  }
}