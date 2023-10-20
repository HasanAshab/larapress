import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeMail extends ComponentGenerator {
  signature = "make:mail {name}";
  
  protected template() {
    return "mail";
  }
  
  protected dist() {
    return `app/mails/${this.argument("name")}Mail.ts`;
  }
}