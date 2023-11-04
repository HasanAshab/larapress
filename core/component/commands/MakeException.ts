import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeException extends ComponentGenerator {
   signature = "make:exception {name}";
  
  protected template() {
    return "exception";
  }
  
  protected dist() {
    return `app/exceptions/${this.argument(`name`)}Exception.ts`;
  }
}