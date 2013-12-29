var app = angular.module('app', []);

app.directive('multipleSelect', function ($timeout) {
    return {
        restrict: 'A', // matches using attributes
        link: function (scope, element, attrs) {
            $timeout(function () {
                console.log(scope.selectedCourses);
                element.find('select')
                    .multiSelect({ selectableOptgroup: true })
                    .multiSelect('select', scope.selectedCourses);
            });
        }
    }
});

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

        $scope.check = function (i) {
            if ($scope.status[i] !== 'disabled') {
                if ($scope.list[i] === 0) {
                    $scope.list[i] = 1;
                    $scope.status[i] = 'true';
                } else {
                    $scope.list[i] = 0;
                    $scope.status[i] = 'false';
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
            mask: '='
        },
        templateUrl: '/partials/checkList.html',
        controller: checkController
    }

});

app.controller('hoursController', function ($scope, $http) {

    // try to apply previous data
    $scope.staff = window.staff;

    $http.get('/api/courses/'+$scope.staff.location)
        .success(function (data) {
            $scope.catalog = _.groupBy(data, function (val) {
                return val.subject.title;
            });
        });

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

    if (!!$scope.staff.courses) {
        $scope.selectedCourses = $scope.staff.courses;
    }

    if (!!$scope.staff.phone) {
        $scope.phoneNumber = $scope.staff.phone;
    }

    $scope.times = [];

    var j = 9, afterNoon = false;
    for (var i = 0; i <= 20; i++) {
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

        /*
        if (!afterNoon) {
            time += ' AM';
        } else {
            time += ' PM';
        }
        */
        if (i != 0) {
            $scope.times[i-1] += '-' + time;
        }
        if (i != 20) {
            $scope.times[i] = time;
        }
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
