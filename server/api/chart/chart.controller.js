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
  var contentId = 7742012887400515;

  db.maps.findOne({ contentId: contentId }, function(err, result) {
    res.json(result);
  });
};

exports.post = function(req, res) {
  /** persist submission to submissions collection **/
  var args = {
    item: 'ABC1',
    details: {
      model: '14Q3',
      manufacturer: 'XYZ Company'
    }
  };

  //var args = req.body;

  db.submissions.insert(args,
    function(err, records) {
      /* return something??? */
    });

  var contentId = 7742012887400515;

  /** persist heat map update to maps collection **/
  db.maps.findOne({ contentId: contentId }, function(err, result) {
    var newHeatMap;
    if (result) {
      /** save new heat map into map collection **/

      // not correct logic just a placeholder
      result.heatMap = result.heatMap + args.heatMap;
    }
    else {
      /** no result use sumission line **/

      // not correct logic just a placeholder
      newHeatMap = args.heatMap;
    }

    db.maps.save(result, function(err, obj) {
      if (err) {
        asd;
      }
      else {
        res.send('success!');
      }
    });
  });
};
