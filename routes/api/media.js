const express = require('express');
const router = express.Router();
const MediaController = controller('MediaController');

// Endpoints for serving files
router.get('/media/:id', MediaController.index);

module.exports = router;