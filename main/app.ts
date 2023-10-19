import Application from "~/core/Application";
import { middleware } from "~/core/utils";

console.time("Bootstrap")
// Create Application instance
const app = new Application();
console.timeEnd("Bootstrap")
export default app;

