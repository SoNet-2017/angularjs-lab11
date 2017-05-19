'use strict';

angular.module('myApp.pizzaView', ['ngRoute','myApp.pizza'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pizzaView', {
    templateUrl: 'pizzaView/pizzaView.html',
    controller: 'View1Ctrl',
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

.controller('View1Ctrl', ['$scope','Pizza', function($scope,Pizza) {
    $scope.dati={};
    $scope.dati.pizzas = Pizza.getData();
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6qAQOEvZs2XlUUu3ziu-nrDX-WWZXap4";
    $scope.dati.vm = this;
    $scope.dati.vm.positions = [];
    $scope.dati.pizzas.$loaded().then(function () {
        console.log($scope.dati.pizzas.length);
        for (var i = 0; i < $scope.dati.pizzas.length; i++) {
            var lat = 45.071087 + (Math.random() / 100);
            var lng = 7.686567 + (Math.random() / 100);
            $scope.dati.vm.positions.push({lat: lat, lng: lng});
        }
        console.log("vm.positions", $scope.dati.vm.positions);
    });
}]);