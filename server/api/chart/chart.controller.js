'use strict';

var _ = require('lodash');
var request = require('request');
var config = require('../../config/environment');
var heatmap = require('./heatmap');
var mongo = require('mongoskin');

var db = mongo.db(config.mongo.uri);
db.bind('submissions');

//db.bind('maps');

exports.getHeatMap = function(req, res) {
  /** query to get heat map **/
  var contentId = req.params.contentId;

  if (!contentId) {
    res.status(400).send('Invalid arguments.');
  }

  db.submissions.find({ contentId: +contentId})
    .limit(100).toArray(function(error, result) {
      if (error) {
        res.status(400).send('SQL Error.');
      }

      res.json(result);
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
  //   var userHeatMap = heatmap.interpolateUserLine(args.userLine, args.xRange, args.yRange);
  //
  //   if (result) {
  //     /** save new heat map into map collection **/
  //     result.heatMap = heatmap.sumDenseArrays(result.heatMap, userHeatMap);
  //   }
  //   else {
  //     /** no result use submission line **/
  //     result = {
  //       contentId: contentId,
  //       heatMap: userHeatMap
  //     };
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
