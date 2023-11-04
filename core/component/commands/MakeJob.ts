import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeJob extends ComponentGenerator {
   signature = "make:job {name}";
  
  protected template() {
    return "job";
  }
  
  protected dist() {
    return `app/jobs/${this.argument(`name`)}.ts`;
  }
}