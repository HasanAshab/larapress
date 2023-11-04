import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeMiddleware extends ComponentGenerator {
   signature = "make:middleware {name} {--v|version=v1}";
  
  protected template() {
    return "middleware";
  }
  
  protected dist() {
    return `app/http/${this.argument("version")}/middlewares/${this.argument("name")}.ts`;
  }
}