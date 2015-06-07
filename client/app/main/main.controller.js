'use strict';

angular.module('lockerdomeApp')
  .controller('MainCtrl', function ($scope, $state) {
    /* Declarations */
    $scope.articles = [
      {
        title: 'Daily Facebook Usage vs Overall Happiness',
        content: 'We can write a sweet article here with some awesome <i>embedded</i> <code>HTML</code> tags that will ' +
          'get rendered properly.  Since we are running an AngularJS framework for our <sub>front-end</sub> we can just' +
          ' drop these articles into a javascript array and they will render correctly.  This also means we could grab ' +
          'the content from an API if we chose to.'
      },
      {
        title: 'Daily Facebook Usage vs Overall Happiness',
        content: 'We can write a sweet article here with some awesome <i>embedded</i> <code>HTML</code> tags that will ' +
          'get rendered properly.  Since we are running an AngularJS framework for our <sub>front-end</sub> we can just' +
          ' drop these articles into a javascript array and they will render correctly.  This also means we could grab ' +
          'the content from an API if we chose to.'
      },
      {
        title: 'Daily Facebook Usage vs Overall Happiness',
        content: 'We can write a sweet article here with some awesome <i>embedded</i> <code>HTML</code> tags that will ' +
          'get rendered properly.  Since we are running an AngularJS framework for our <sub>front-end</sub> we can just' +
          ' drop these articles into a javascript array and they will render correctly.  This also means we could grab ' +
          'the content from an API if we chose to.'
      }
    ];

    /* Functions */
    $scope.goToCreate = function () {
      $state.go('create');
    };
  });
