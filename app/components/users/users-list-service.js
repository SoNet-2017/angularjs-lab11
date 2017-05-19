'use strict';

angular.module('myApp.users.usersListService', [])

    .factory('UserList', function($firebaseArray) {
        var userListService = {
            getListOfUsers: function () {
                //get the list of logged users
                var ref = firebase.database().ref().child("users");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return userListService;
    });