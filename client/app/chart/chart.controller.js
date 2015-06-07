// jshint camelcase:false
'use strict';

function ChartCtrl($http, $location, $q, $scope, $window, accountId, appId, idUrl, loginToken, args) {
  var contentId = _.get(args, 'id');
  var operation = _.get(args, 'op');
  $scope.idUrl = idUrl;
  $scope.contentId = contentId;
  $scope.url = idUrl.toString() + '/7740067434987585/' + contentId.toString();
  console.log(idUrl, contentId, $scope.url)
  $scope.errors = [];
  $scope.showResults = false;

  // private
  function init() {
    if (operation !== 'render_content') {
      $scope.errors.push('Operation not defined' + operation);
      return;
    }
    var url = '/api/content?' + encodeURIComponent(JSON.stringify({
      content_id: contentId
    }));
    $scope.contentPromise = $http.get(url)
      .then(function (data) {
        data = data.data;
        if (!data.status || !data.result) {
          return $q.reject(data.error_message);
        }

        var appData = data.result.app_data;
        $scope.headline = data.result.name;
        $scope.content = data.result.text;
        $scope.thumbUrl = data.result.thumb_url;
        $scope.type = appData.type;
        $scope.xLabel = appData.xAxis.label;
        $scope.yLabel = appData.yAxis.label;
        $scope.rangeX = [appData.xAxis.min, appData.xAxis.max, appData.xAxis.step];
        $scope.yRange = [appData.yAxis.min, appData.yAxis.max, appData.yAxis.step];
        $scope.trueLine = appData.trueLine;

        $scope.loaded = true;
      }, function (data) {
        return $q.reject(data.error_message);
      })
      .catch(function (error) {
        if (error) {
          $scope.errors.push(error);
        } else {
          $scope.errors.push('Unknown Error: Content Data Fetch');
        }
      });

    $scope.heatmapPromise = $http.get('/api/chart/' + contentId.toString())
      .then(function (data) {
        if (!data.status) {
          return $q.reject(data.error_message);
        }
        $scope.heatmap = _.pluck(data.data, 'userLine');
      }, function (data) {
        return $q.reject(data.error_message);
      })
      .catch(function (error) {
        if (error) {
          $scope.errors.push(error);
        } else {
          $scope.errors.push('Unknown Error: Heatmap Data Fetch');
        }
      });

    $scope.$on('d3chart::sendUserLine', function (event, userLine) {
      if (!userLine) {
        alert('Please fill out the rest of the chart');
        return;
      }

      $scope.submission = $http.post('/api/chart/', {
        contentId: contentId,
        accountId: accountId,
        loginToken: loginToken,
        userLine: userLine,
        xRange: $scope.rangeX,
        yRange: $scope.yRange
      })
        .then(function (data) {
          if (!data.status) {
            return $q.reject(data.error_message);
          }

          $scope.showResults = true;
          $scope.showHeatmap = true;

        }, function (data) {
          return $q.reject(data.error_message);
        })
        .catch(function (error) {
          if (error) {
            $scope.errors.push(error);
          } else {
            $scope.errors.push('Unknown Error: Data Submission');
          }
        });
    });

    $window.parent.postMessage(JSON.stringify({
      name: 'request_height',
      args: ['250px']
    }), '*');
    // $window.parent.postMessage(JSON.stringify({
    //   name: 'request_width',
    //   args: ['800px']
    // }), '*');
  }

  // public
  $scope.handleSubmission = function() {
    $scope.$broadcast('d3chart::getUserLine');
  };

  $scope.handleClear = function() {
    $scope.clearData = true;
  };

  $scope.redirect = function () {
    $window.parent.postMessage(JSON.stringify({
      name: 'request_redirect',
      path: $scope.url
    }), '*');
    // $window.location.href = $scope.url;
  };

  init();
}

angular
  .module('lockerdomeApp')
  .controller('ChartCtrl', [
    '$http',
    '$location',
    '$q',
    '$scope',
    '$window',
    'accountId',
    'appId',
    'idUrl',
    'loginToken',
    'args',
    ChartCtrl
  ]);
