'use strict';

angular.module('myApp.pizza.pizzaService', [])

    .factory('Pizza', function($firebaseArray) {
        var pizzaService = {
            getData: function () {
                var ref = firebase.database().ref().child("pizzas");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return pizzaService;
    });
