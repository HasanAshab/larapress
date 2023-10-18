import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
import "~/vendor/autoload";
import Application from "~/core/Application";
import Artisan from 'Artisan';

const app = new Application();


const [baseInput, ...args] = process.argv.splice(2);
Artisan.call(baseInput, args)
