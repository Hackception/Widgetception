'use strict';

var _ = require('lodash');
var request = require('request');
var config = require('../../config/environment')
var mongo = require('mongoskin');

var db = mongo.db(config.mongo.uri);
db.bind('submissions');
db.bind('maps');

exports.getHeatMap = function(req, res) {
  /** query to get heat map **/
  var contentId = req.param.contentId;

  if (!contentId) {
    res.status(400).send('Invalid arguments.');
  }

  db.maps.findOne({ contentId: contentId }, function(err, result) {
    if (result) {
      res.json(result);
    }
    else {
      res.status(400).send('Heat map not found.');
    }
  });
};

exports.post = function(req, res) {
  /** persist submission to submissions collection **/
  var args = req.body;

  if (!(args && args.contentId > 0 && args.accountId > 0)) {
    res.status(400).send('Invalid arguments.');
  }

  db.submissions.insert(args,
    function(err, records) {
      res.send('success!');
    });

  // var contentId = args.contentId;
  //
  // /** persist heat map update to maps collection **/
  // db.maps.findOne({ contentId: contentId }, function(err, result) {
  //   if (result) {
  //     /** save new heat map into map collection **/
  //
  //     // not correct logic just a placeholder
  //     result.heatMap = result.heatMap + args.userLine;
  //   }
  //   else {
  //     /** no result use submission line **/
  //     result = {};
  //
  //     // not correct logic just a placeholder
  //     result.heatMap = args.userLine;
  //   }
  //
  //   db.maps.save(result, function(err, obj) {
  //     if (err) {
  //       res.status(400).send('Failure');
  //     }
  //     else {
  //       res.send('success!');
  //     }
  //   });
  // });
};
