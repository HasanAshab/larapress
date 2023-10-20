import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeController extends ComponentGenerator {
  signature = "make:controller {name} {--v|version=v1}";
  
  protected template() {
    return "controller";
  }
  
  protected dist() {
    return `app/http/${this.argument("version")}/controllers/${this.argument("name")}Controller.ts`;
  }
}