'use strict';

angular.module('myApp.authentication.authenticationService', [])

    .factory('Auth', ["$firebaseAuth", function($firebaseAuth) {
            return $firebaseAuth();
    }]);
