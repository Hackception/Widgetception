'use strict';

angular.module('lockerdomeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chart', {
        url: '/bacon?:junk',
        templateUrl: 'app/chart/chart.html',
        controller: 'ChartCtrl',
        resolve: {
          accountId: ['$location', function ($location) {
            return JSON.parse(Object.keys($location.search())[0]).account_id;
          }],
          appId: ['$location', function ($location) {
            return JSON.parse(Object.keys($location.search())[0]).app_id;
          }],
          idUrl: ['$location', function ($location) {
            return JSON.parse(Object.keys($location.search())[0]).ld_url;
          }],
          loginToken: ['$location', function ($location) {
            return JSON.parse(Object.keys($location.search())[0]).login_token;
          }],
          args: ['$location', function ($location) {
            return (JSON.parse(Object.keys($location.search())[0]).args || {});
          }]
        }
      });
  });
