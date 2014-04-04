angular.module('app.directives', [])


// Awesome directive to paginate a collection of objects.
.directive('tableView', function () {
    return {
        restrict: 'AE',
        templateUrl: '/partials/tableView.html',
        scope: {
            objects: '=',
            keys: '=',
            add: '=',
            update: '=',
            remove: '=',
            // initial sorting
            order: '@',
            reverse: '@'
        },
        link: function (scope, element, attrs) {

            // setup some sane defaults
            scope.order   = (scope.order == undefined)?   '_id' : scope.order;
            scope.reverse = (scope.reverse == undefined)? false : scope.reverse;

            scope.fields = [];
            scope.newObject = {};

            scope.$watch('keys', function () {
                scope.keys = _.map(scope.keys, function (key) {
                    if (_.isObject(key)) {
                        return key;
                    } else {
                        return { 
                            field: key.split('.')[0],
                            editable: false,
                            related: {
                                field: ''
                            }
                        };
                    }
                });
            }, true);

            // Wouldn't it be grand if we could sort!
            scope.sort = function (key) {
                // already selected, toggle reverse
                if (key == scope.order) {
                    scope.reverse = !scope.reverse;
                } else {
                    scope.reverse = false;
                    scope.order = key;
                }
            };

        }
    }
})

.directive('toggle', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            element.find('.toggle-button').click(function () {
                console.log(this);
                element.find('.toggle-content').slideToggle();
            });
        }
    }
})

.directive('multipleSelect', function ($timeout) {
    return {
        restrict: 'A', // matches using attributes
        link: function (scope, element, attrs) {
            $timeout(function () {
                element.find('select')
                    .multiSelect({ selectableOptgroup: true })
                    .multiSelect('select', scope.selectedCourses);
            });
        }
    }
})

.directive('checkList', function () {

    function checkController ($scope) {

        $scope.status = Array($scope.list.length);

        // initialize the check list
        for (var i = 0; i < $scope.list.length; i++) {
            // is the item masked out?
            if (!!$scope.mask && !$scope.mask[i]) {
                $scope.status[i] = 'disabled';
                $scope.list[i] = 0;
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
                if (!$scope.inc1[i]) {
                    $scope.inc1[i] = 0;
                }
                if ($scope.list[i] === 1) {
                    $scope.inc1[i]++;
                }
            }
        }
        if (!!$scope.inc2) {
            for (var i = 0; i < $scope.inc2.length; i++) {
                if (!$scope.inc2[i]) {
                    $scope.inc2[i] = 0;
                }
                if ($scope.list[i] === 1) {
                    $scope.inc2[i]++;
                }
            }
        }

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

})

.directive('checkListReadOnly', function () {

    function checkController ($scope) {

        $scope.status = Array($scope.list.length);

        // initialize the check list
        for (var i = 0; i < $scope.list.length; i++) {
            // is the item masked out?
            if (!!$scope.mask && !$scope.mask[i]) {
                $scope.status[i] = 'disabled';
                $scope.list[i] = 0;
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
                if (!$scope.inc1[i]) {
                    $scope.inc1[i] = 0;
                }
                if ($scope.list[i] === 1) {
                    $scope.inc1[i]++;
                }
            }
        }
        if (!!$scope.inc2) {
            for (var i = 0; i < $scope.inc2.length; i++) {
                if (!$scope.inc2[i]) {
                    $scope.inc2[i] = 0;
                }
                if ($scope.list[i] === 1) {
                    $scope.inc2[i]++;
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

})

.directive('timeList', function () {

    function timeController($scope) {
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
