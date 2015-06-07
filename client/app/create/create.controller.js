'use strict';

angular.module('lockerdomeApp')
  .controller('CreateCtrl', function ($http, $scope, $state, $timeout) {
    /* Declarations */
    $scope.chartTypes = [{
      name: 'Line Chart',
      value: 'lineChart'
    }];
    $scope.model = {
      app_data: {},
      csv: []
    };
    $scope.submitted = false;

    /* Functions */
    /**
     * Create a reader for parsing an imported file into a json object we can use.
     *
     * @param {Object} inputElement
     */
    $scope.csvChange = function (inputElement) {
      var reader = new FileReader();

      reader.onload = function (loadEvent) {
        $scope.model.csv = loadEvent.target.result.split('\n').map(function (input) {
          var parsed = input.split(',');
          parsed =  {
            x: +parsed[0],
            y: +parsed[1]
          };
          return parsed.x && parsed.y ? parsed : false;
        }).filter(Boolean);

        $scope.createWidgetForm.csv.$setDirty();

        if (!_.isEmpty($scope.model.csv)) {
          $scope.createWidgetForm.csv.$setValidity('required', true);
        } else {
          $scope.createWidgetForm.csv.$setValidity('required', false);
        }

        $scope.$digest();
      };

      if (!_.isEmpty(angular.element(inputElement)[0].files) && angular.element(inputElement)[0].files[0]) {
        reader.readAsText(angular.element(inputElement)[0].files[0]);
      } else {
        $scope.createWidgetForm.csv.$setValidity('required', false);
        $scope.$digest();
      }
    };
    /**
     * Parses the model to fit the lockerdome API then posts the the server pass-through.
     */
    $scope.submit = function () {
      if ($scope.submitted || $scope.submissionError) {
        return;
      }
      $scope.submitted = true;

      $scope.submitPromise = $http.post('/api/content', {
        app_data: {
          trueLine: $scope.model.csv,
          type: $scope.model.app_data.type,
          xAxis: $scope.model.app_data.xAxis,
          yAxis: $scope.model.app_data.yAxis
        },
        name: $scope.model.name,
        text: $scope.model.text
      }).then(
        function () {
          var timeoutPromise = $timeout(function () {
            $scope.submitted = true;
            $timeout.cancel(timeoutPromise);
            $state.go('main');
          }, 3000);
        }, function () {
          var timeoutPromise = $timeout(function () {
            $scope.submissionError = true;
            $timeout.cancel(timeoutPromise);
          }, 3000);
        });
    };

    /* Watchers */
    $scope.$watch('model.app_data.type', function (newType, oldType) {
      if (newType !== oldType && newType) {
        $timeout(function () {
          $scope.createWidgetForm.csv.$setValidity('required', false);
        });
      }
    }, true);

    /**
     * @typedef {Object} CreateContentBody
     * @property {String} name
     * @property {String} text
     * @property {AppData} app_data
     */
    /**
     * @typedef {Object} AppData
     * @property {String} type
     * @property {Point[]} trueLine
     * @property {Axis} xAxis
     * @property {Axis} yAxis
     */
    /**
     * @typedef {Object} Axis
     * @property {String} label
     * @property {Number} min
     * @property {Number} max
     * @property {Number} step
     */
    /**
     * @typedef {Object} Point
     * @property {Number} x
     * @property {Number} y
     */
  });
