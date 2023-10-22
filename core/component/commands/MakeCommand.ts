import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeCommand extends ComponentGenerator {
  static signature = "make:command {name}";
  
  protected template() {
    return "command";
  }
  
  protected dist() {
    return `app/commands/${this.argument(`name`)}.ts`;
  }
}