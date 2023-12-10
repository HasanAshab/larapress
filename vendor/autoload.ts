import packageConfig from "../package.json" assert { type: "json" };

const loadPromises = packageConfig.autoload.map(async path => {
  Object.assign(globalThis, await import(path));
});

await Promise.all(loadPromises);