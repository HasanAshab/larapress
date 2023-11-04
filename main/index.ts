import "reflect-metadata";
import "dotenv/config";

if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest") {
  require('module-alias/register');
}
import "~/vendor/autoload";
import "Config/load";
import Config from "Config";
import app from "~/main/app";
import DB from "DB";

// Connecting to database
if(Config.get("database.connect")) {
  DB.connect().then(() => {
    console.log("Connected to Database!");
  }).catch(err => {
    console.log("Couldn't connect to Database. reason: " + err);
  });
}

/*
const loadBalancerConfig = Config.get<any>("loadBalancer");
if(loadBalancerConfig.enabled) {
    console.log(`load Balancer: [http://127.0.0.1:${Config.get("app.port")}]\n`)
    console.log("Server Instances:")
    for (const port of loadBalancerConfig.ports) {
      app.http.listen(port, () => {
        console.log(`[http://127.0.0.1:${port}]`);
      }).on("connection", (socket) => {
        const time = new Date().toLocaleTimeString("en-US", { hour12: true });
        shouldLog && console.log(`*New connection on port ${port} [${time}]`);
      });
    }
  }
else {
  const port = Config.get<number>("app.port");
  const server = app.http.listen(port, () => {
    shouldLog && console.log(`Server running on [http://127.0.0.1:${port}] ...`);
  });
  shouldLog && server.on("connection", (socket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: true });
    console.log(`*New connection: [${time}]`);
  });
}
*/

const port = Config.get<number>("app.port");
app.server.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

app.server.on("connection", () => {
  const time = new Date().toLocaleTimeString("en-US", { hour12: true });
  console.log(`*New connection: [${time}]`);
});


/*
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
*/