declare global {
  function log(data: any): Promise<void>;
  function trace(message: string, logFullTrace = false): void;
  function env(key: string, fallback?: string): string | undefined;
  function putEnv(data: Record<string, string>): Promise<void>;
  function base(...basePaths: string[]): string;
  function getParams(func: Function): string[];
  function randomStr(length: number): string;
  function sleep(ms: number): Promise<void>;
  function resolve<T = unknown>(dependency: string | Function): T;
}

export {};
