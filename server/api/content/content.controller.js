'use strict';

var _ = require('lodash');
var request = require('request');
var config = require('../../config/environment')

exports.getContent = function(req, res) {
  /** call lockerdome api to get content data **/
  var args = JSON.parse(decodeURIComponent(req._parsedUrl.query || "{}"));
  doGet('/app_fetch_content?', args, res);
};

exports.createContent = function(req, res) {
  /** call lockerdome api to create content **/
  var args = req.body;
  doGet('/app_create_content?', args, res);
};

function doGet(service, args, res) {
  args.app_id = config.app.id;
  args.app_secret = config.app.secret;

  var url = config.ldUrl + service + encodeURIComponent(JSON.stringify(args));

  request.get(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.json(JSON.parse(body));
    }
    else {
      res.status(403).json({error: error});
    }
  })
}
