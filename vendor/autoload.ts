import { autoload } from "~/package";

for(const path of autoload)
  Object.assign(globalThis, require(path));
  
