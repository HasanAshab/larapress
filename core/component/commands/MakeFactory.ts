import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeFactory extends ComponentGenerator {
  static signature = "make:factory {name}";
  
  protected template() {
    return "factory";
  }
  
  protected dist() {
    return `database/factories/${this.argument("name")}Factory.ts`;
  }
}