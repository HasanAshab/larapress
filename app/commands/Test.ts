import Command from "illuminate/commands/Command";
//const User = require(base("app/models/User"));
//const DB = require(base("illuminate/utils/DB"));

export default class Test extends Command {
  description = 'this is test'
  options = [
    {
      flag: '-p, --port <port>',
      message: 'Port to run the app',
      default: 8000
    }
  ]
  
  async handle(foo: string, bar: string, options: string[]){
    this._greet()
    this.success('Yeh!');
    console.log(foo, bar, options)
    console.log(this.subCommand)
  };
  
  async other(a: string, options: string[]){
    console.log(a, options)
    console.log(this.subCommand)
  };
  
  _greet(){
    console.log('hello')
  }
}