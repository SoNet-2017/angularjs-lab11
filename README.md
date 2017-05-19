## AngularJS + Firebase: chat integration ##

#### Part 1: save logged users ####

1. POpen your project (imported from [https://github.com/SoNet-2017/angularjs-lab10](https://github.com/SoNet-2017/angularjs-lab10).
 
2. We want to add the chat: each user should be able to chat with other logged users.

3. First of all it is necessary to know which are the users that are logged in our app. Consequently, modify the data structure stored on firebase to obtain something similar to the following structure:

    ```
    {
        "PizzaSonet2017":
        {
            "pizzas":{...},
            "users":
            {
                "-KHsxHNkaRghLRQA-mL-":
                {
                    "email": "myemail@myserver.it",
                    "logged": "true"
                }
            }
        }
    }
    ```

We are simply adding a new element ("users") that will contain the list of all registered users and some other information about them.

4. Now we are ready to modify our app.

5. First of all, let's understand the detailed functionalities that we want to implement:
- every time a user is logged into the system its user id (provided by firebase) will be used as parent of all her data (in the example, the id is "-KHsxHNkaRghLRQA-mL-")
- inside the user structure we will insert a "logged" field in which we will store true when the user logs in, and false when she logs out (in future implementation)
- create a list of all the available users (we establish if their are logged because of the "logged" field)
- allow to chat with a selected user

6. Let's look, as usual, in the AngularFire documentation to understand how we can write into the database.

7. From the main page of the AngularFire repository (https://github.com/firebase/angularfire), click on "Quickstart"

8. Reading the sixth point (6. Synchronize Collections as Arrays), the documentation says:
    ```
    AngularFire provides a set of methods compatible with manipulating synchronized arrays: $add(), $save(), and $remove().
    ```
    
9. Thus, in loginView, when the login is performed, we want to:
- add the user id in the list of users (if the user was not yet created)
- set "true" as "logged" value

10. Create a new service to do the just specified actions
- create a new folder "users" inside the "components" one
- create a parent service users.js
     ```
     'use strict';
     
     angular.module('myApp.users', [
         'myApp.users.usersService'
     ])
     
     .value('version', '0.1');
     ```
- and its child users-service.js
     ```
    'use strict';
    
    angular.module('myApp.users.usersService', [])
    .factory('Users', function() {
        var userService = {
            registerLogin: function (userId, email) {
                //add the user to list of users and set the logged value to true
                
            }
        };
        return userService;
    });

     ```
11. Insert the new script inside index.html
     ```
    <script src="components/users/users.js"></script>
    <script src="components/users/users-service.js"></script>
     ```
12. Specify the created parent module as dependence of the main module of the app (in app.js):
     ```
    angular.module('myApp', [
        ...,
        'myApp.users'
    ])
     ```

13. Modify the controller contained in the loginView.js file in this way:
    ```
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', '$log', 'Users', function($scope, Auth, $location, $log, Users) {
        $scope.user={};
        $scope.auth = Auth; //acquires authentication from app.js (if it was done)
    
        $scope.signIn = function() {
            $scope.firebaseUser = null;
            $scope.error = null;
            $scope.auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                var userId = firebaseUser.uid;
                Users.registerLogin(userId, $scope.user.email);
                // login successful: redirect to the pizza list
                $location.path("/pizzaView");
            }).catch(function(error) {
                $scope.error = error;
                $log.error(error.message);
            });
        };
    }]);
    ```
    (
    what is important:
    - add dependency from the "Users" service
    - get the user email from the "firebaseUser" object
    - call the function Users.registerLogin, passing the userid and the user email
    )

14. Now, we have to actually insert the value on firebase.
Looking at the documentation there is one method that seems to work as expected: $add.
Thus, coming back to the documentation (at the same point analyzed in 8. ("Synchronize Collections as Arrays" section of https://github.com/firebase/angularfire/blob/master/docs/quickstart.md), there is an example that could help us. Copy the reported code and modify the service declared in users-service.js:
    ```
    .factory('Users', function($firebaseArray) {
            var userService = {
                registerLogin: function (userId, email) {
                    //add the user to list of users and set the logged value to true
                    var ref = firebase.database().ref().child("users").child(userId);
                    // create a synchronized array
                    $firebaseArray(ref).$add({
                        email: email,
                        logged: true
                    });
                }
            };
            return userService;
        });
    ```
    
15. Try to run the project and perform the login. If we look at the data inserted on firebase we will find something similar to this:

    ```
    ...
    "users":
    {
        "-KHsxHNkaRghLRQA-mL-":
        {
            "<newValue>":
            {
                "email": "myemail@myserver.it",
                "logged": "true"
            }
        }
    }
    ```
    
16. There is something strange: we wanted to insert email and logged diretly under the user id, while a new value was inserted in the middle.
 Why? It is because, as reported in the [API Reference](https://github.com/firebase/angularfire/blob/master/docs/reference.md#save) documentation, the "$add" method ```creates a new record in the database```.
 Thus, we have to find something else to insert the value in the database.

17. Looking at the [API Reference](https://github.com/firebase/angularfire/blob/master/docs/reference.md#save) we cannot find anything that satisfies our needs. But there is a sentence that says that all the objects implemented in the guide are simply instances of the main object "firebase.database.Reference", and there is a link to the official firebase documentation:
[firebase.database.Reference](https://firebase.google.com/docs/reference/js/firebase.database.Reference)

18. Here we can find more methods and functions that could be applied to our objects, and specifically we can find the [set()](https://firebase.google.com/docs/reference/js/firebase.database.Reference#set).
Some examples show us how to use it to set a value, so we will modify our service in this way:
    ```
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
    ```
    
19. Now our application will work just in the expected way.


#### Part 2: implement the list of available users ####

20. Let's create a view with the list of available users

21. Create a new folder "usersListView"

22. Create a "usersListView.html" file containing this simple line:
    ```
    <a  ng-repeat="user in dati.availableUsers" href="#!/chat/{{user.userId}}">{{user.email}}</a>
    ```
    
23. Create a "usersListView.js" file containing this code:
    ```
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
    .controller('usersListViewCtrl', ['$scope', '$routeParams',
        function($scope, $routeParams) {
            $scope.dati = {};
        }]);
    ```
    
24. Insert the new script inside index.html
     ```
    <script src="usersListView/usersListView.js"></script>
     ```
25. Specify the created module as dependence of the main module of the app (in app.js):
     ```
    angular.module('myApp', [
        ...,
        'myApp.usersListView'
    ])
     ```

26. Try if everything continues to work fine

27. Modify the controller "usersListViewCtrl" so that it can take the list of logged users from firebase.
    a) create a new service in components/users: users-list-service.js
    ```
    'use strict';
    
    angular.module('myApp.users.usersListService', [])
    
    .factory('UserList', function($firebaseArray) {
       var userListService = {
           getListOfUsers: function () {
               //get the list of logged users
           }
       };
       return userListService;
    });
    ```
     b) Insert the new script inside index.html
      ```
     <script src="components/users/users-list-service.js"></script>
      ```
     c) Modify the controller in order to get the list from the just created list:
     ```
        .controller('usersListViewCtrl', ['$scope', '$routeParams', 'UserList',
            function($scope, $routeParams, UserList) {
                $scope.dati = {};
                $scope.dati.availableUsers = UserList.getListOfUsers();
            }]);
     ```
     
28. As already done in pizza-service.js we can take the list of users by using the following code (copy it in users-list-service.js)
    ```
    
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
    ```
    
29. Finally, create a button in the bottom of your page (in index.html) to load the list:
    ```
      <li><a href="#!/usersList"><span class="glyphicon glyphicon-comment"></span></a></li>
    ```

30. To improve the functionality to show only logged users that are not the current one, we can modify:
- usersListView.js
    ```
    .controller('usersListViewCtrl', ['$scope', '$routeParams', 'UserList', 'currentAuth',
      function($scope, $routeParams, UserList, currentAuth) {
          $scope.dati = {};
          $scope.dati.availableUsers = UserList.getListOfUsers();
          $scope.dati.userId = currentAuth.uid;
      }]);
    ```
- usersListView.html
    ```
    <a  ng-repeat="user in testValue=(dati.availableUsers | filter:{logged:true} | filter:{$id: '!' + dati.userId})" href="#!/chat/{{user.$id}}">{{user.email}}</a>
    <p ng-show="!testValue.length">No available users</p>
    ```


#### Part 3: implement the chat view ####

31. Create a new view for the chat
- create a new folder "chatView"
- create a file "chatView.js"
    ```
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
        .controller('chatViewCtrl', ['$scope', '$routeParams', 'currentAuth',
            function($scope, $routeParams, currentAuth) {
                $scope.dati = {};
                $scope.userId = currentAuth.uid;
                $scope.dati.recipientUserId = $routeParams.recipientUserId;
            }]);
    ```
- create a file chatView.html
    ```
        <div class="row">
            <div class="col-xs-12 col-md-4">
                <div id="messagesDiv">
                    <div ng-repeat="msg in dati.messages  | orderBy:orderProp" ng-if="[dati.userId, dati.recipientUserId].indexOf(msg.sender) > -1 && [dati.userId, dati.recipientUserId].indexOf(msg.receiver) > -1 ">
                        <em>{{msg.utctime}} - {{msg.senderName}}</em>: {{msg.text}}
                    </div>
                </div>
                {{dati.userInfo.email}}: <input type="text" ng-model="dati.msg" ng-keydown="addMessage($event)" placeholder="Message...">
            </div>
        </div>
    ```
- Insert the new script inside index.html
    ```
    <script src="chatView/chatView.js"></script>
    ```
- Insert the new module inside app.js
    ```
    angular.module('myApp', [
        ... ,
        'myApp.chatView'
    ])
    ```
32. Add a new node to firebase to obtain something similar to the following structure:
    ```
  
    {
        "PizzaSonet2017":
        {
            "pizzas":{...},
            "users":{...},
            "messages":
            [
                "-KHsxHNkaRghLRQA-mL-":
                {
                    receiver: "09646c5a-bb75-4b5e-a1b2-c18cf2e1744d"
                    sender: "19da485f-ce9f-431a-85e6-5467b2b6417a"
                    senderName: "Teodoro"
                    text: "ciao"
                    utctime:  "2016-05-16-09:45:52"
                }
            ]
        }
    }
    ```
33. Create a new service inside the "users" folder:
- create a file "user-chat-service.js"
    ```
    'use strict';
    
    angular.module('myApp.users.usersChatService', [])

    .factory('UsersChatService', function usersChatService($firebaseArray, $firebaseObject) {
        var ref = firebase.database().ref().child("messages");
        return {
            getMessages: function() {
                return $firebaseArray(ref);
            },

            getUserInfo: function(userId) {
                var userRef = firebase.database().ref().child("users").child(userId);
                return $firebaseObject(userRef);
            },
            createMessage: function(sender, senderName, receiver, text){
                var newMessage = {};
                newMessage['sender'] = sender;
                newMessage['senderName'] = senderName;
                newMessage['receiver'] = receiver;
                newMessage['text'] = text;
                var today = new Date();
                var day = today.getUTCDate();
                var month = today.getUTCMonth()+1; //January is 0!
                var year = today.getUTCFullYear();
                var hours = today.getUTCHours();
                var minutes = today.getUTCMinutes();
                var seconds = today.getUTCSeconds();

                if(day<10) {
                    day='0'+day;
                }

                if(month<10) {
                    month='0'+month;
                }
                if(hours<10) {
                    hours='0'+hours;
                }
                if(minutes<10) {
                    minutes='0'+minutes;
                }
                if(seconds<10) {
                    seconds='0'+seconds;
                }
                var currentDate = year.toString()+'-'+month.toString()+'-'+day.toString()+'-'+hours.toString()+':'+minutes.toString()+':'+seconds.toString();
                newMessage['utctime'] = currentDate;
                return newMessage;
            },
            addMessage: function(message) {
                return $firebaseArray(ref).$add(message);
            }
        };
    });
    ```
- add its dependence in users.js
    ```
    'use strict';
    
    angular.module('myApp.users', [
        'myApp.users.usersService',
        'myApp.users.usersListService',
        'myApp.users.usersChatService' 
    ])
    
    .value('version', '0.1');
    ```
- add it in index.html
    ``` 
    <script src="components/users/user-chat-service.js"></script>
    ``` 
34. Modify chatView/chatView.js:

    ```
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
    ```
