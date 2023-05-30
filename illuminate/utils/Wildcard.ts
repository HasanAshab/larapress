export default class Wildcard {
  static match(str: string, query: string): boolean {
    const regexQuery = query
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace("*", `([^${query.split("*")[1]}]+)`)
    .replaceAll("*", "\\*");
    const regex = new RegExp(regexQuery);
    return regex.test(str);
  }

  static replace(str: string, query: string, replacement: string, replacedStr = str): string {
    const regexQuery = query
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace("*", `([^${query.split("*")[1]}]+)`)
    .replaceAll("*", "\\*");
    const regex = new RegExp(regexQuery, "g");
    return str.replace(regex, (_, wildcard) => replacement.replaceAll("*", wildcard))
  }
}