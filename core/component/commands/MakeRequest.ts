import ComponentGenerator from "~/core/component/ComponentGenerator";


export default class MakeRequest extends ComponentGenerator<{ version: string }> {
   signature = "make:request {name} {--v|version=v1}";
  
  protected template() {
    return "request";
  }
  
  protected dist() {
    return `app/http/requests/${this.option("version")}/${this.argument("name")}Request.ts`;
  }
}