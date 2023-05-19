require('dotenv').config();
import Artisan from 'illuminate/utils/Artisan';

const args = process.argv;

try {
  Artisan.call(args.splice(2));
} 
catch (err) {
  console.log(err);
  process.exit(1);
}
