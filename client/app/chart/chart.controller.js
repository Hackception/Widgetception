// jshint camelcase:false
'use strict';

function ChartCtrl($http, $q, $scope, accountId, appId, idUrl, loginToken, argsClean) {
  var args = JSON.parse(argsClean);
  var contentId = _.get(args, 'id');
  var operation = _.get(args, 'op');

  var contentPromise, heatmapPromise;
  var type;
  var headline;
  var content;
  var thumbUrl;
  var xLabel, xRange;
  var yLabel, yRange;
  var trueLine;

  var showResults = false;
  var showHeatmap = false;
  var clearData = false;
  var errors = [];

  // private
  function init() {
//     if (operation !== 'render_content') {
//       errors.push('Operation not defined');
//       return;
//     }
//     console.log('json', JSON.stringify({
//       content_id: contentId
//     }))
//     var url = '/api/content?' + encodeURIComponent(JSON.stringify({
//       content_id: contentId
//     }));
// console.log(url)
//     contentPromise = $http.get(url)
//       .then(function (data) {
//         console.log(data)
//         if (!data.status || !data.result) {
//           return $q.reject(data.error_message);
//         }
//
//         var appData = data.result.app_data;
//         headline = data.result.name;
//         content = data.result.text;
//         thumbUrl = data.result.thumb_url;
//         type = appData.type;
//         xLabel = appData.xAxis.label;
//         xRange = [appData.xAxis.min, appData.xAxis.max, appData.xAxis.step];
//         yRange = [appData.yAxis.min, appData.yAxis.max, appData.yAxis.step];
//         trueLine = appData.trueLine;
//
//       }, function (data) {
//         return $q.reject(data.error_message);
//       })
//       .catch(function (error) {
//         if (error) {
//           errors.push(error);
//         } else {
//           errors.push('Unknown Error: Content Data Fetch');
//         }
//       });
//
//     // TODO: Fetch Heatmap Data
//     heatmapPromise = $http.get('')
//       .then(function (data) {
//         if (!data.status) {
//           return $q.reject(data.error_message);
//         }
//       }, function (data) {
//         return $q.reject(data.error_message);
//       })
//       .catch(function (error) {
//         if (error) {
//           errors.push(error);
//         } else {
//           // errors.push('Unknown Error: Heatmap Data Fetch');
//         }
//       });

    $scope.$on('d3chart::sendUserLine', function (event, userLine) {
console.log(event, userLine)
      $http.post('/api/chart/', {
        contentId: 0,
        // contentId: contentId,
        accountId: 0,
        // accountId: accountId,
        loginToken: 0,
        // loginToken: loginToken,
        userLine: userLine
      })
        .then(function (data) {
          if (!data.status) {
            return $q.reject(data.error_message);
          }

          this.showResults = true;
          this.showHeatmap = true;

        }, function (data) {
          return $q.reject(data.error_message);
        })
        .catch(function (error) {
          if (error) {
            errors.push(error);
          } else {
            errors.push('Unknown Error: Data Submission');
          }
        });
    });

  }

  // public
  function handleSubmission() {
    console.log('submit')

    $scope.$broadcast('d3chart::getUserLine');

    // TODO: Post user data

  }

  function handleClear() {
    console.log('cleared Data')
    this.clearData = true;
  }

  // exports
  angular.extend(this, {

    // Content Data
    contentRender: contentPromise,
    heatmapRender: heatmapPromise,
    headline: headline,
    content: content,
    thumbUrl: thumbUrl,
    labelX: xLabel,
    rangeX: xRange,
    yLabel: yLabel,
    yRange: yRange,
    trueLine: trueLine,

    showResults: showResults,
    showHeatmap: showHeatmap,
    errors: errors,
    handleSubmission: handleSubmission,
    handleClear: handleClear,
    clearData: clearData,

  });

  angular.extend(this, {
    labelX: 'garbage',
    rangeX: [0, 20, 1],
    yLabel: 'tools',
    yRange: [0, 10, 1],
  });


  init();
}

angular
  .module('lockerdomeApp')
  .controller('ChartCtrl', [
    '$http',
    '$q',
    '$scope',
    'accountId',
    'appId',
    'idUrl',
    'loginToken',
    'args',
    ChartCtrl
  ]);
