import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeController extends ComponentGenerator {
  static signature = "make:controller {--v|version=v1} {--api} {name}";
  
  protected template() {
    return "controller/" + (this.option("api") ? "api" : "general");
  }
  
  protected dist() {
    return `app/http/${this.argument("version")}/controllers/${this.argument("name")}Controller.ts`;
  }
}