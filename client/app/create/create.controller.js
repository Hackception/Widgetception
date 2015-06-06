'use strict';

angular.module('lockerdomeApp')
  .controller('CreateCtrl', function ($scope, $timeout) {
    /* Declarations */
    $scope.model = {
      csv: [],
      data: {}
    };
    $scope.chartTypes = [{
      name: 'Line Chart',
      value: 'lineChart'
    }];

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
     * TODO: call the API and submit the data, while submitting display a nice loading indicator, finish by clearing the
     *  form on success or displaying an error on failure.
     */
    $scope.submit = function () {
      console.log($scope.model);
    };

    /* Watchers */
    $scope.$watch('model.data.type', function (newType, oldType) {
      if (newType !== oldType && newType) {
        $timeout(function () {
          $scope.createWidgetForm.csv.$setValidity('required', false);
        });
      }
    }, true);
  });
