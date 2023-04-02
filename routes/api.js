const express = require('express');
const router = express.Router();
const { controller } = require('../helpers');

// Here should be register all endpoints for api

router.get('/', (req, res)=>{
  res.send('Hello from api');
});

module.exports = router;