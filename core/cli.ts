import "reflect-metadata";
import "dotenv/config";

process.env.NODE_ENV = "shell";

import "~/vendor/autoload";
import "Config/load";
//import "~/main/app";

import { SamerArtisan } from 'samer-artisan';

SamerArtisan.root(base())
  .add("app/commands/Search")
  .parse().then(() => process.exit(0));