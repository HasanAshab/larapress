import "reflect-metadata";
import "dotenv/config";
process.env.NODE_ENV = "shell";
import Artisan from 'Artisan';
Artisan.call(process.argv.splice(2));

