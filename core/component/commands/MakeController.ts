import ComponentGenerator from "~/core/component/ComponentGenerator";

interface Options {
  version: string;
  api: boolean;
  invokable: boolean;
}

export default class MakeController extends ComponentGenerator<Options> {
   signature = "make:controller {--v|version=v1} {--api} {--invokable} {name}";
  
  protected template() {
    let type = "general";
    if(this.option("api"))
      type = "api";
    else if(this.option("invokable"))
      type = "invokable";
      
    return "controller/" + type;
  }
  
  protected dist() {
    return `app/http/controllers/${this.option("version")}/${this.argument("name")}Controller.ts`;
  }
}