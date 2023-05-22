function getWildcard(str, query, wildcards = []) {
  if (query.split("*").length - 1 !== 1) return null;
  const withoutWildcard = query.split("*");
  const startIndex = str.indexOf(withoutWildcard[0]) + withoutWildcard[0].length;
  if (typeof query[withoutWildcard[0].length + 1] === "undefined") return str.substring(startIndex);
  const endIndex = str.indexOf(withoutWildcard[1], startIndex);
  if(startIndex === -1 || endIndex === -1) return wildcards;
  const wildcard = str.substring(startIndex, endIndex);
  return getWildcard(str.substring(endIndex), query, [...wildcards, wildcard]);
}

function replaceWildcard(str, query, replacement, replacedStr = str){
  if (query.split("*").length - 1 !== 1) return null;
  const withoutWildcard = query.split("*");
  const startIndex = str.indexOf(withoutWildcard[0]) + withoutWildcard[0].length;
  if (withoutWildcard[1] === ""){
    const wildcard = str.substring(startIndex);
    return replacedStr.replace(query.replace("*", wildcard), replacement.replace("*", wildcard))
  }
  const endIndex = str.indexOf(withoutWildcard[1], startIndex);
  if(startIndex === -1 || endIndex === -1) return replacedStr;
  const wildcard = str.substring(startIndex, endIndex);
  replacedStr = replacedStr.replace(query.replace("*", wildcard), replacement.replace("*", wildcard));
  return replaceWildcard(str.substring(endIndex), query, replacement, replacedStr);
}

let content = `
import { base } from 'helpers';
import { getWildcard } from "illuminate/utils";
import Command from 'illuminate/commands/Command';
import fs from 'fs';
import path from 'path';
import samertube from 'samerltd';
`;

const query = "*";
const replacement = "[*] ehhe"

console.log(replaceWildcard(content, query, replacement));

