import Application from "~/core/Application";
import { middleware } from "~/core/utils";

// Create Application instance
const app = Application();

// Bootstrap the App
app.bootstrap();

// Error handlers
app.use(middleware("global.responser", "error.handle"));

export default app;

