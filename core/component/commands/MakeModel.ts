import ComponentGenerator from "~/core/component/ComponentGenerator";
import { execSync } from "child_process";
import componentsPath from "~/core/component/paths";
import fs from "fs";
import path from "path";


export default class MakeModel extends ComponentGenerator {
  signature = "make:model {name}";
  
  protected template() {
    return "model";
  }
  
  protected path() {
    return "model";
  }
}