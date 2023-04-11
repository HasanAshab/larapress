const express = require('express');
const router = express.Router();

// Here should be register all endpoints for web
router.get('/', (req, res)=>{
  res.render('postman', {layout:false});
});

module.exports = router;