'use strict';

angular.module('lockerdomeApp')
  .controller('CreateCtrl', function ($scope) {
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
      };
      reader.readAsText(angular.element(inputElement)[0].files[0]);
    };
    /**
     * Parses the model to fit the lockerdome API then posts the the server pass-through.
     */
    $scope.submit = function () {
      console.log($scope.model);
    };

    /* Initialization */

    /* Watchers */
  });
