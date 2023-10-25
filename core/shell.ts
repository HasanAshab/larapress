import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
import "~/vendor/autoload";
import "Config/load";
import "~/main/app";
import Artisan from 'Artisan';


const [baseInput, ...args] = process.argv.splice(2);
Artisan.call(baseInput, args);
