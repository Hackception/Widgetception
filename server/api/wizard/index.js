'use strict';

var express = require('express');
var controller = require('./wizard.controller');

var router = express.Router();

router.get('/', controller.get);

router.post('/', controller.post);

module.exports = router;
