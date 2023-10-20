import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeFactory extends ComponentGenerator {
  signature = "make:factory {name}";
  
  protected template() {
    return "factory";
  }
  
  protected dist() {
    return `database/factories/${this.argument("name")}Factory.ts`;
  }
}