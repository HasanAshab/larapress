import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeProvider extends ComponentGenerator {
  signature = "make:provider {name}";
  
  protected template() {
    return "provider";
  }
  
  protected dist() {
    return `app/providers/${this.argument(`name`)}ServiceProvider.ts`;
  }
}