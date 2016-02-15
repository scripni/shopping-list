'use strict';

angular.module('shoppingListApp', [])
  .controller('homeCtrl',
    function homeCtrl($scope) {
      $scope.list = {
        items: [
          {
            name: "milk",
            quantity: 2
          },
          {
            name: "bread",
            quantity: 4
          }
        ]
      };

      $scope.addToList = function() {
        console.log($scope.toAdd);
        $scope.list.items.push({
          name: $scope.toAdd,
          quantity: 1
        });

        $scope.toAdd = '';
      };
    }
  );