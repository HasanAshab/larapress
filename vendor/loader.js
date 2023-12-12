import {
  resolve as resolveTs,
  getFormat,
  transformSource,
  load,
} from "ts-node/esm";
import * as tsConfigPaths from "tsconfig-paths"
export { getFormat, transformSource, load };

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)

export function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier);
  return resolveTs(mappedSpecifier ?? specifier, context, defaultResolver);
}