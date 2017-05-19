'use strict';

angular.module('myApp.users.usersService', [])

    .factory('Users', function($firebaseArray) {
        var userService = {
            registerLogin: function (userId, email) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.set({
                    email: email,
                    logged: true
                });
            }
        };
        return userService;
    });
