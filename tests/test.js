const register = require('../main/register');
register.registerHelpers();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require(base('main/app'));


require("dotenv").config();

