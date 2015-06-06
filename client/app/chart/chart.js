'use strict';

angular.module('lockerdomeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chart', {
        url: '/bacon?account_id&app_id&Id_url&login_token&args',
        templateUrl: 'app/chart/chart.html',
        controller: 'ChartCtrl'
      });
  });
