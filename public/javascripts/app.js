var app = angular.module('app', ['ngRoute'])
.config(['$routeProvider', 
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/schedule.html'
            }).
            when('/users', {
                templateUrl: 'partials/users.html'
            }).
            otherwise({ redirectTo: '/' });
    }]);

app.directive('checkList', function () {

    function checkController ($scope) {

        $scope.status = Array($scope.list.length);

        // initialize the check list
        for (var i = 0; i < $scope.list.length; i++) {
            // is the item masked out?
            if (!!$scope.mask && !$scope.mask[i]) {
                $scope.status[i] = 'disabled';
            } else {
                if (!$scope.list[i]) {
                    $scope.list[i] = 0;
                    $scope.status[i] = 'false';
                } else {
                    $scope.status[i] = 'true';
                }
            }
        }

        // initialize partial sums
        if (!!$scope.inc1) {
            for (var i = 0; i < $scope.inc1.length; i++) {
                $scope.inc1[i] = 0;
            }
        }
        if (!!$scope.inc1) {
            for (var i = 0; i < $scope.inc2.length; i++) {
                $scope.inc2[i] = 0;
            }
        }
        if (!$scope.acc) { $scope.acc = 0; }

        $scope.check = function (i) {
            if ($scope.status[i] !== 'disabled') {
                if ($scope.list[i] === 0) {
                    $scope.list[i] = 1;
                    $scope.status[i] = 'true';
                    if (!!$scope.inc1)    { $scope.inc1[i]++; }
                    if (!!$scope.inc2)    { $scope.inc2[i]++; }
                    if (!!($scope.acc+1)) { $scope.acc++;     }
                } else {
                    $scope.list[i] = 0;
                    $scope.status[i] = 'false';
                    if (!!$scope.inc1)    { $scope.inc1[i]--; }
                    if (!!$scope.inc2)    { $scope.inc2[i]--; }
                    if (!!($scope.acc+1)) { $scope.acc--;     }
                }
            }
        }
    }

    return {
        restrict: 'AE', // matches using attributes and elements name
        //replace: true,
        transclude: true,
        scope: {
            list: '=',
            mask: '=',
            acc: '=',
            inc1: '=',
            inc2: '=' 
        },
        link: function (scope, element, attrs) {
        },
        templateUrl: '/partials/checkList.html',
        controller: checkController
    }

});

app.directive('timeList', function () {

    function timeController($scope) {
        $scope.times = [];
        var j = 9, afterNoon = false;
        for (var i = 1; i <= 20; i++) {
            var time;
            // hit noon
            if (j % 12 === 0) {
                afterNoon = true;
                time = "12"
            } else {
                time = '' + j % 12;
            }

            // full hour
            if (i % 2 === 0) {
                time += ':00'
            // half hour
            } else {
                 time += ':30'
                j++;
            }

            if (!afterNoon) {
                time += ' AM';
            } else {
                time += ' PM';
            }
            $scope.times[i] = time;
        }
    }

    return {
        restrict: 'AE',
        transclude: true,
        scope: {
            class: '=',
            start: '=',
            stop: '=',
            diff: '=',
            count: '='
        },
        templateUrl: '/partials/timeList.html',
        controller: timeController
    }
});

// Authentication service 
app.service('userService', function ($http, $rootScope) {

    var self = this;

    self.status = { logged: false };

    // Try to get user data on service startup
    $http.get('/api/user').success(function (data) {
        if (!!data.username) {
            self.status['user'] = data;
            self.status.logged = true;
        }
    });

    this.login = function (user, pass, call) {
        $http.post('/api/login', {
            username: user,
            password: pass 
        }).success(function (data) {
            if (!!data.username) {
                self.status['user'] = data;
                self.status.logged = true;
                call(false, data);
            }
        }).error(function () {
            call(true);
        });
    };
});

app.controller('schedulerController', function ($scope, $http) {

    $scope.days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday'
    ];
    
    $scope.sums = {};
    $scope.total = {
        monday: Array(20),
        tuesday: Array(20),
        wednesday: Array(20),
        thursday: Array(20),
        friday: Array(20)
    };

    $http.get('/api/staff').success(function (data) {
        for (var i = 0; i < data.length; i++) {
            data[i].schedule.monday = Array(20);
            data[i].schedule.tuesday = Array(20);
            data[i].schedule.wednesday = Array(20);
            data[i].schedule.thursday = Array(20);
            data[i].schedule.friday = Array(20);
        }
        $scope.majors = _.groupBy(data, 'major');
        for (major in Object.keys($scope.majors)) {
            $scope.sums[major] = {
                monday: Array(20),
                tuesday: Array(20),
                wednesday: Array(20),
                thursday: Array(20),
                friday: Array(20)
            }
        }
    });
});
