'use strict';

angular.module('myApp.detailsView', ['ngRoute','myApp.pizza'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/detailsPizza/:pizzaId', {
    templateUrl: 'detailsView/detailsView.html',
    controller: 'detailsViewCtrl',
      resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
              // $requireSignIn returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $routeChangeError (see above)
              return Auth.$requireSignIn();
          }]

      }
  })
}])
//Inline Array Annotation
    //Here we pass an array whose elements consist of a list of strings (the names of the dependencies)
    // followed by the function itself.
    //When using this type of annotation, take care to keep the annotation array
    // in sync with the parameters in the function declaration.
.controller('detailsViewCtrl', ['$scope', '$routeParams', 'SinglePizza',
    function($scope, $routeParams, SinglePizza) {
        $scope.dati = {};
        $scope.dati.pizza = SinglePizza.getSinglePizza($routeParams.pizzaId);
        $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6qAQOEvZs2XlUUu3ziu-nrDX-WWZXap4";
        $scope.dati.vm = this;
        $scope.dati.vm.positions = [];
        $scope.dati.pizza.$loaded().then(function () {
            var address = $scope.dati.pizza.address;
            $scope.dati.vm.positions.push({address: address});
            console.log("vm.positions", $scope.dati.vm.positions);
        });
    }]);