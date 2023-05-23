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

function matchWildcard(str, query) {
  const regexQuery = query
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace("*", "(.+)")
    .replaceAll("*", "\\*");
  const regex = new RegExp(regexQuery);
  return regex.test(str);
}

function replaceWildcard(str, query, replacement) {
  const regexQuery = query
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace("*", "(.+)")
    .replaceAll("*", "\\*");
  console.log(regexQuery)
  const regex = new RegExp(regexQuery, "g");
  return str.replace(regex, (_, wildcard) => replacement.replaceAll("*", wildcard));
}

let content = `
importfrom jill
import { base } from 'helpers';
import { getWildcard } from "illuminate/utils";
import Command from 'illuminate/commands/Command';
import fs from 'fs';
import path from 'path';
import samertube from 'samerltd';
`;

content2 = `
var __importDefault = (this && this.importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("illuminate/commands/Command"));
const helpers_1 = require("helpers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
`

const query = "import*from";
const replacement = "from*import [*]"
console.log(replaceWildcard(content, query, replacement));
//console.log(matchWildcard(content, query));

