import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeListener extends ComponentGenerator {
  static signature = "make:listener {name}";
  
  protected template() {
    return "listener";
  }
  
  protected dist() {
    return `app/listeners/${this.argument(`name`)}.ts`;
  }
}