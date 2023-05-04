const express = require('express');
const router = express.Router();
const MediaController = require(base('app/http/controllers/MediaController'));

// Endpoints for serving files
router.get('/:id', MediaController.index);

module.exports = router;