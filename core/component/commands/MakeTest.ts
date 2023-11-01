import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeTest extends ComponentGenerator {
  static signature = "make:test {name} {--u|unit}";
  
  protected template() {
    return "test/" + (this.option("unit") ? "u" : "f");
  }

  protected dist() {
    return this.option("unit")
      ? `tests/unit/${this.argument("name")}.test.ts`
      : `tests/feature/${this.argument("name")}.test.ts`;
  }
}