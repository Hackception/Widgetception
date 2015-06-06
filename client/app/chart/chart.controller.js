'use strict';

function ChartCtrl($http, $q, $stateParams) {
  var accountId = $stateParams.accountId;
  var appId = $stateParams.appId;
  var idUrl = $stateParams.idUrl;
  var loginToken = $stateParams.loginToken;
  var args = JSON.parse($stateParams.args);
  var contentId = _.get(args, 'id');
  var operation = _.get(args, 'op');

  var contentPromise, heatmapPromise;
  var headline;
  var content;
  var thumbUrl;
  var xLabel, xMin, xMax, xStep;
  var yLabel, yMin, yMax, yStep;
  var trueLine;

  var showResults = false;
  var showHeatmap = false;
  var errors = [];

  // private
  function init() {
    if (operation === 'render_content') {
      var url = '/content?' + escape(JSON.stringify({
        app_id: appId,
        content_id: contentId
      }));
      contentPromise = $http.get(url)
        .then(function (data) {

          if (!data.status) {
            return $q.reject(data.error_message);
          }

          var appData = data.result.app_data;
          headline = data.result.name;
          content = data.result.text;
          thumbUrl = data.result.thumb_url;
          xLabel = appData.xAxisLabel;
          xMin = appData.xAxisMin;
          xMax = appData.xAxisMax;
          xStep = appData.yAxisStep;
          yLabel = appData.yAxisLabel;
          yMin = appData.yAxisMin;
          yMax = appData.yAxisMax;
          yStep = appData.yAxisStep;
          trueLine = appData.trueLine;

        }, function (data) {
          return $q.reject(data.error_message);
        })
        .catch(function (error) {
          if (error) {
            errors.push(error);
          } else {
            // errors.push('Unknown Error: Content Data Fetch');
          }
        });

      // TODO: Fetch Heatmap Data
      heatmapPromise = $http.get('')
        .then(function (data) {
          if (!data.status) {
            return $q.reject(data.error_message);
          }
        }, function (data) {
          return $q.reject(data.error_message);
        })
        .catch(function (error) {
          if (error) {
            errors.push(error);
          } else {
            // errors.push('Unknown Error: Heatmap Data Fetch');
          }
        });
    }
  }

  // public
  function handleSubmission() {
    // TODO: Post user data
    $http.post('', {})
      .then(function (data) {
        if (!data.status) {
          return $q.reject(data.error_message);
        }

        showResults = true;
        showHeatmap = true;

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
  }

  function handleClear() {
    // TODO: Clear Data
  }

  // exports
  angular.extend(this, {

    // Content Data
    contentRender: contentPromise,
    heatmapRender: heatmapPromise,
    headline: headline,
    content: content,
    thumbUrl: thumbUrl,
    xLabel: xLabel,
    xMin: xMin,
    xMax: xMax,
    xStep: xStep,
    yLabel: yLabel,
    yMin: yMin,
    yMax: yMax,
    yStep: yStep,
    trueLine: trueLine,

    showResults: showResults,
    showHeatmap: showHeatmap,
    errors: errors,
    handleSubmission: handleSubmission,
    handleClear: handleClear

  });

  init();
}

angular
  .module('lockerdomeApp')
  .controller('ChartCtrl', [
    '$http',
    '$q',
    '$stateParams',
    ChartCtrl
  ]);
