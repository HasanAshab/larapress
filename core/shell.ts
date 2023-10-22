import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
import "~/vendor/autoload";
import app from "~/main/app";
import Artisan from 'Artisan';

const [baseInput, ...args] = process.argv.splice(2);
Artisan.call(baseInput, args);
