import ComponentGenerator from "~/core/component/ComponentGenerator";

interface Options {
  version: string;
  api: boolean;
  invokable: boolean;
}

export default class MakeResource extends ComponentGenerator<Options> {
   signature = "make:resource {--v|version=v1} {name}";
  
  protected template() {
    return "resource";
  }
  
  protected dist() {
    return `app/http/resources/${this.option("version")}/${this.argument("name")}Resource.ts`;
  }
}