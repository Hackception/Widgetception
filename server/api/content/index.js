'use strict';

var express = require('express');
var controller = require('./content.controller');

var router = express.Router();

router.get('/', controller.getContent);

router.post('/', controller.createContent);

module.exports = router;
