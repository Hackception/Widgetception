'use strict';

angular.module('lockerdomeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chart', {
        url: '/bacon?account_id&app_id&Id_url&login_token&args',
        templateUrl: 'app/chart/chart.html',
        controller: 'ChartCtrl',
        controllerAs: 'vm',
        resolve: {
          accountId: ['$stateParams', function ($stateParams) {
            return $stateParams.account_id;
          }],
          appId: ['$stateParams', function ($stateParams) {
            return $stateParams.app_id;
          }],
          idUrl: ['$stateParams', function ($stateParams) {
            return $stateParams.Id_url;
          }],
          loginToken: ['$stateParams', function ($stateParams) {
            return $stateParams.login_token;
          }],
          args: ['$stateParams', function ($stateParams) {
            return $stateParams.args;
          }]
        }
      });
  });
