import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeRouter extends ComponentGenerator {
  signature = "make:router {name}";
  
  protected template() {
    return "router";
  }
  
  protected dist() {
    return `routes/${this.argument(`name`)}.ts`;
  }
}