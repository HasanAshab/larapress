import ArtisanError from "illuminate/exceptions/utils/ArtisanError";

export default abstract class Command {
  constructor(public subCommand?: string, public fromShell: boolean = true, public flags: string[] = [], public params: Record<string, string> = {}){
    this.subCommand = subCommand;
    this.fromShell = fromShell;
    this.flags = flags;
    this.params = params;
  }
  
  subCommandRequired(name: string): string {
    if(typeof this.subCommand === "undefined"){
      throw ArtisanError.type("SUB_COMMAND_REQUIRED").create({name});
    }
    return this.subCommand as string;
  }
  
  requiredParams(requiredParamsName: string[]){
    for(const name of requiredParamsName){
      if(typeof this.params[name] === "undefined"){
        throw ArtisanError.type("REQUIRED_PARAM_MISSING").create({param:name});
      }
    }
  }
  
  info(text: string): void{
    console.log("\x1b[33m", text, "\x1b[0m");
  }

  success(text = ""): void{
    console.log("\x1b[32m", "\n", text, "\n", "\x1b[0m");
    if(this.fromShell){
      process.exit(0);
    }
  }

  error(text = ""): void{
    console.log("\x1b[31m", "\n", text, "\n", "\x1b[0m");
    if(this.fromShell){
      process.exit(1);
    }
  }
}