'use strict';

var _ = require('lodash');
var request = require('request');
var config = require('../../config/environment')
var mongo = require('mongoskin');

var db = mongo.db(config.mongo.uri);
db.bind('submission');

exports.getHeatMap = function(req, res) {
  /** query to get heat map **/
  db.submission.find().toArray(function(err, items) {
    res.json(items);
  });
};

exports.post = function(req, res) {
  /** save submission in MongoDB **/
  var args = {
    item: 'ABC1',
    details: {
      model: '14Q3',
      manufacturer: 'XYZ Company'
    }
  };

  //var args = req.body;

  db.submission.insert(args,
    function(err, records) {
      /* return something??? */
      res.json(records);
    });
};
