//import { autoload } from "~/package";
const { autoload } = require(process.cwd() + "/package");

for(const path of autoload)
  Object.assign(globalThis, require(path));
  
