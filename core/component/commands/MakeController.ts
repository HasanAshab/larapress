import ComponentGenerator from "~/core/component/ComponentGenerator";

interface Options {
  version: string;
  api: boolean;
}

export default class MakeController extends ComponentGenerator<Options> {
   signature = "make:controller {--v|version=v1} {--api} {name}";
  
  protected template() {
    return "controller/" + (this.option("api") ? "api" : "general");
  }
  
  protected dist() {
    return `app/http/controllers/${this.option("version")}/${this.argument("name")}Controller.ts`;
  }
}