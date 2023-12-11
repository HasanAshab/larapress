declare global {
  function importModule<T = unknown>(specifier: string): Promise<T>;
  function importDefault<T = unknown>(specifier: string): Promise<T>;
  function resolve<T = unknown>(dependency: string | Function): T;
  function log(data: any): Promise<void>;
  function trace(message: string, logFullTrace = false): void;
  function env(key: string, fallback?: string): string | undefined;
  function putEnv(data: Record<string, string>): Promise<void>;
  function base(...basePaths: string[]): string;
  function getParams(func: Function): string[];
  function randomStr(length: number): string;
  function isPureObject(target: any): target is object;
  function sleep(ms: number): Promise<void>;
  function toHumanReadableFormat(date: string | Date): string;
}

export {};
