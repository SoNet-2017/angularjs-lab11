'use strict';

angular.module('myApp.usersListView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/usersList', {
            templateUrl: 'usersListView/usersListView.html',
            controller: 'usersListViewCtrl',
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
    .controller('usersListViewCtrl', ['$scope', '$routeParams', 'UserList', 'currentAuth',
        function($scope, $routeParams, UserList, currentAuth) {
            $scope.dati = {};
            $scope.dati.availableUsers = UserList.getListOfUsers();
            $scope.dati.userId = currentAuth.uid;
        }]);