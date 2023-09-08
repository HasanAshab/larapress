import Command from "~/core/abstract/Command";

export default class Test extends Command {
  async handle(){
    console.log(this.params)
  }
}