'use strict';

angular.module('myApp.pizza.singlePizzaService', [])

    .factory('SinglePizza', function($firebaseObject) {
        var singlePizzaService = {
            getSinglePizza: function (pizzaId) {
                var ref = firebase.database().ref().child("pizzas").child(pizzaId);
                // download the data into a local object
                return $firebaseObject(ref);
            }
        };
        return singlePizzaService;
    });
