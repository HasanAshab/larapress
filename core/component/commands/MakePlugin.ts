import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakePlugin extends ComponentGenerator {
  static signature = "make:plugin {name}";
  
  protected template() {
    return "plugin";
  }
  
  protected dist() {
    return `app/plugins/${this.argument(`name`)}.ts`;
  }
}