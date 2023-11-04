import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeRequest extends ComponentGenerator {
   signature = "make:request {name} {--v|version=v1}";
  
  protected template() {
    return "request";
  }
  
  protected dist() {
    return `app/http/${this.argument("version")}/requests/${this.argument("name")}Request.ts`;
  }
}