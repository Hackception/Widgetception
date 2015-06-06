'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://admin:gh4admin@ds045242.mongolab.com:45242/heroku_app37579984'
  },

  seedDB: true,

  ldUrl: 'http://api.globalhack4.test.lockerdome.com'
};
