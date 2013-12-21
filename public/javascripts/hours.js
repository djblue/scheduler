var app = angular.module('app', []);

app.directive('checkList', function () {

    function checkController ($scope) {

        $scope.active = false;

        // initialize the check list
        for (var i = 0; i < $scope.list.length; i++) {
            if ($scope.list[i] === undefined) {
                $scope.list[i] = 0;
            }
        }

        $scope.check = function (i) {
            if ($scope.list[i] === 0) {
                $scope.list[i] = 1;
                $scope.active = true;
            } else {
                $scope.list[i] = 0;
                $scope.active = false;
            }
        }
    }

    return {
        restrict: 'AE', // matches using attribues and elements name
        //replace: true,
        transclude: true,
        scope: {
            list: '='
        },
        templateUrl: '/partials/checkList.html',
        controller: checkController
    }

});

app.controller('hoursController', function ($scope, $http) {

    $http.get('/api/courses')
        .success(function (data) {
            $scope.catalog = _.groupBy(data, function (val) {
                return val.subject.title;
            });
        });

    // try to apply previous data
    $scope.staff = window.staff;

    // staff member with no availability listed
    if ($scope.staff.availability.monday.length === 0) {
        $scope.days = {
            monday: Array(20),
            tuesday: Array(20),
            wednesday: Array(20),
            thursday: Array(20),
            friday: Array(20)
        };
    } else {
        $scope.days = $scope.staff.availability;
    }

    if (!!$scope.staff.max) {
        $scope.maxHours = $scope.staff.max;
    }

    if (!!$scope.staff.phone) {
        $scope.phoneNumber = $scope.staff.phone;
    }

    $scope.times = ['Time'];

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

    $scope.submit = function () {
        $http.post(document.URL, {
            availability: $scope.days,
            courses: $scope.selectedCourses,
            phone: $scope.phoneNumber,
            max: $scope.maxHours
        })
        .success(function (data) {
            console.log(data);
        })
        .error(function () {
        });
    };
});
