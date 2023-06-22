import "dotenv/config";
import Artisan from 'illuminate/utils/Artisan';
const args = process.argv;
Artisan.call(args[2], args.splice(2));
