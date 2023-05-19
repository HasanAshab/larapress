export default abstract class Command {
  //abstract handle
  constructor(public subCommand?: string, public fromShell: boolean = true, public flags: string[] = [], public params: {[key: string]: string} = {}){
    this.subCommand = subCommand;
    this.fromShell = fromShell;
    this.flags = flags;
    this.params = params;
  }
  
  info(text: string): void{
    console.log('\x1b[33m', text, '\x1b[0m');
  }

  success(text: string): void{
    console.log('\x1b[32m', '\n', text, '\n', '\x1b[0m');
    if(this.fromShell){
      process.exit(0);
    }
  }

  error(text: string): void{
    console.log('\x1b[31m', '\n', text, '\n', '\x1b[0m');
    if(this.fromShell){
      process.exit(1);
    }
  }
}