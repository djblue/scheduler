var app = angular.module('app', ['app.directives']);

app.controller('hoursController', function ($scope, $http) {

    // try to apply previous data
    $scope.staff = window.staff;
    $scope.mask = $scope.staff.location.hours;
    $scope.catalog = _.groupBy(window.courses, function (val) {
        return val.subject.title;
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
        console.log($scope.maxHours);
        $http.post(document.URL, {
            availability: $scope.days,
            courses: $scope.selectedCourses,
            phone: $scope.phoneNumber,
            max: $scope.maxHours
        })
        .success(function (data) {
            $scope.success = true;
        })
        .error(function () {
        });
    };
});
