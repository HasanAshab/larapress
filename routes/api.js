const express = require('express');
const router = express.Router();
const { controller, middleware } = require('../helpers');

// Here should be register all endpoints for api

router.get('/', middleware('auth:api'), (req, res)=>{
  res.send('Hello from api');
});

module.exports = router;