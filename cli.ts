import "dotenv/config";
import 'module-alias/register';
process.env.NODE_ENV = "shell";
import Artisan from 'Artisan';
const args = process.argv;
Artisan.call(args[2], args.splice(2));
