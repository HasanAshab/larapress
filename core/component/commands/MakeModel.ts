import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeModel extends ComponentGenerator {
  static signature = "make:model {name}";
  
  protected template() {
    return "model";
  }
  
  protected dist() {
    return `app/models/${this.argument(`name`)}.ts`;
  }
}