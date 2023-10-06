import ServiceProvider from "~/core/abstract/ServiceProvider";

export default class AutoloadServiceProvider extends ServiceProvider {
  private autoloadFiles = [
    "~/core/helpers"
  ];
  
  boot() {
    for(const path of this.autoloadFiles)
      Object.assign(global, require(path));
  }
}