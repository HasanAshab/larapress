import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeNotification extends ComponentGenerator {
  static signature = "make:notification {name}";
  
  protected template() {
    return "request";
  }
  
  protected dist() {
    return `app/notifications/${this.argument(`name`)}.ts`;
  }
}