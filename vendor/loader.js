import {
  resolve as resolveTs,
  getFormat,
  transformSource,
  load,
} from "ts-node/esm/transpile-only";
import * as tsConfigPaths from "tsconfig-paths"
export { getFormat, transformSource, load };
import { statSync } from "fs";

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)

export function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier);
 /* if (mappedSpecifier) {
    try {
      specifier = statSync(mappedSpecifier).isFile()
        ?`${mappedSpecifier}.ts`
        : `${mappedSpecifier}/index.ts`;
    }
    catch {
      specifier = `${mappedSpecifier}.ts`;
    }

  }
        */

  return resolveTs(mappedSpecifier ?? specifier, context, defaultResolver);
}