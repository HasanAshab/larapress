/*
require("reflect-metadata");
require("dotenv/config");
require("module-alias/register");

process.env.NODE_ENV = "shell";

require("~/vendor/autoload");
require("Config/load");
require("~/main/app");

const { SamerArtisan } = require('samer-artisan');

SamerArtisan
  .forceExit()
  .parse();
*/

import "reflect-metadata";
import "dotenv/config";

process.env.NODE_ENV = "shell";

import "~/vendor/autoload";
import "Config/load";
import "~/main/app";

import { SamerArtisan } from 'samer-artisan';

SamerArtisan
  .forceExit()
  .parse();