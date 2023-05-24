import Command from "illuminate/commands/Command";
//const User = require(base("app/models/User"));
//const DB = require(base("illuminate/utils/DB"));

export default class Test extends Command {
  
  async handle(){
    this._greet()
    console.log(this.params)
    console.log(this.flags)
    console.log(this.subCommand)
    this.success("Yeh!");
  };
  
  async other(){
    console.log(this.subCommand)
  };
  
  _greet(){
    console.log("hello")
  }
}