import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakePolicy extends ComponentGenerator {
  static signature = "make:policy {name}";
  
  protected template() {
    return "policy";
  }
  
  protected dist() {
    return `app/policies/${this.argument(`name`)}Policy.ts`;
  }
}