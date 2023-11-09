import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeMiddleware extends ComponentGenerator {
   signature = "make:middleware {name}";
  
  protected template() {
    return "middleware";
  }
  
  protected dist() {
    return `app/http/middlewares/${this.argument("name")}.ts`;
  }
}