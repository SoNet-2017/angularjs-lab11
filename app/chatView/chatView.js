'use strict';

angular.module('myApp.chatView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/chat/:recipientUserId', {
            templateUrl: 'chatView/chatView.html',
            controller: 'chatViewCtrl',
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
    .controller('chatViewCtrl', ['$scope', '$routeParams', 'currentAuth', 'UsersChatService',
        function($scope, $routeParams, currentAuth,UsersChatService) {
            $scope.dati = {};
            $scope.dati.userId = currentAuth.uid;
            $scope.dati.recipientUserId = $routeParams.recipientUserId;

            $scope.orderProp = 'utctime';
            $scope.dati.userInfo = UsersChatService.getUserInfo($scope.dati.userId);

            //get messages from firebase
            $scope.dati.messages = UsersChatService.getMessages();
            //function that add a message on firebase
            $scope.addMessage = function(e) {
                if (e.keyCode != 13) return;
                //create the JSON structure that should be sent to Firebase
                var newMessage = UsersChatService.createMessage($scope.dati.userId, $scope.dati.userInfo.email, $routeParams.recipientUserId, $scope.dati.msg);
                UsersChatService.addMessage(newMessage);
                $scope.dati.msg = "";
            };
        }]);