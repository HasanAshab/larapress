import Application from "~/core/Application";
import { middleware } from "~/core/utils";

// Create Application instance
const app = new Application();

// Bootstrap the App
app.bootstrap();

// Error handlers
app.http.use(middleware("global.responser", "error.handle"));

export default app;

