import Command from "~/core/commands/Command";

export default class Test extends Command {
  async handle(){
    console.log(this.params)
  }
}