import "reflect-metadata";
import "dotenv/config";
import "module-alias/register";

process.env.NODE_ENV = "shell";
import "~/vendor/autoload";
import "Config/load";
import "~/main/app";
import { SamerArtisan } from 'samer-artisan';


SamerArtisan
  .cacheDist("storage/cache/artisan.json")
  .load("dist/app/commands")
  .parse();
