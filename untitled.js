function matchWildcard(str, query) {
  const regexQuery = query
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace("*", "[\\s\\S]+")
    .replaceAll("*", "\\*");
  const regex = new RegExp(regexQuery);
  return regex.test(str);
}

function replaceWildcard(str, query, replacement) {
  const regexQuery = query
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace("*", "([\\s\\S]+)")
    //.replace("*", "(.+)")
    .replaceAll("*", "\\*");
  const regex = new RegExp(regexQuery, "g");
  return str.replace(regex, (_, wildcard) => {
    console.log("its", _, wildcard);
    return replacement.replaceAll("*", wildcard)
  });
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
{[key: string]: string
}
`

const query = "{[key: string]: *}";
const replacement = "Record<string, *>"
console.log(replaceWildcard(content2, query, replacement));
//console.log(matchWildcard(content, query));

