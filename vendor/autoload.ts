import packageConfig from "../package.json" assert { type: "json" };

for(const path of packageConfig.autoload) {
  Object.assign(globalThis, await import(path));
}