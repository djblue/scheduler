var app = angular.module('app', ['ngRoute', 'app.directives'])
.config(['$routeProvider', 
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/schedule.html'
            }).
            when('/users', {
                templateUrl: 'partials/users.html'
            }).
            when('/staff', {
                templateUrl: 'partials/staff.html'
            }).
            when('/staff/:id', {
                templateUrl: 'partials/singleStaff.html'
            }).
            when('/search', {
                templateUrl: 'partials/search.html'
            }).
            when('/help', {
                templateUrl: 'partials/help.html'
            }).
            when('/log', {
                templateUrl: 'partials/log.html'
            }).
            otherwise({ redirectTo: '/' });
    }]);

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
        $scope.majors = _.groupBy(data, function (obj) {
            return obj.major.title;
        });
        var majors = Object.keys($scope.majors);
        for (var i = 0; i < majors.length; i++) {
            $scope.sums[majors[i]] = {
                monday: Array(20),
                tuesday: Array(20),
                wednesday: Array(20),
                thursday: Array(20),
                friday: Array(20)
            }
        }
    });
});

// staff controller
app.controller("StaffController",function ($scope, $http) {

    $http.get('/api/staff').success(function(data) {
        $scope.staff = data;
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
    });

    ///
    $scope.bt1 = "Clear ALL";

    $scope.allEditable = function(){
        if($scope.bt1 === "Clear ALL"){
            $scope.bt1 = "Select ALL";
            for(var i = 0; i < $scope.staff.length; i++){
                $scope.staff[i].editable = false;
                $scope.update($scope.staff[i]);
            }
        }else{
            $scope.bt1 = "Clear ALL";
            for(var i = 0; i < $scope.staff.length; i++){
                $scope.staff[i].editable = true;
                $scope.update($scope.staff[i]);
            }
        }
    };
    ///

    $scope.$watch('staff', function () {
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
        //console.log($scope.staffByLoc);
    }, true);

    $http.get('/api/subjects').success(function (data) {
        $scope.subjects = data;
    });

    $http.get('/api/locations').success(function (data) {
        $scope.locations = data;
    });

    $scope.update = function(contact){
        $http.put('/api/staff/' + contact._id, {editable: !contact.editable}).success(function(){
            contact.editable = !contact.editable;
        });
    };
    
    $scope.addContact = function() {
        $http.post('/api/staff', {
            name: $scope.name, 
            email: $scope.email, 
            major: $scope.major,
            location: $scope.location
        }).success(function(data){
            $scope.staff.push(data);
            $scope.name = '';
            $scope.email = '';
            $scope.major = '';
            $scope.location = '';
        });
    };
     
    $scope.removeContact = function(memberToRemove) {
        var index = $scope.staff.indexOf(memberToRemove);
        $http.delete('/api/staff/' + memberToRemove._id).success(function(){
            $scope.staff.splice(index, 1);    
        });
    };
     
    $scope.clearContact = function(contact) {
        contact.name = '';
        contact.email = '';
        contact.major = '';
    };
});

app.controller('searchController', function ($scope, $http) {
    
    $http.get('/api/subjects').success(function (data) {
        $scope.subjects = data;
    });
    
    $http.get('/api/courses').success(function (data) {
        $scope.coursesReq = data;
    });

    $http.get('/api/staff').success(function(data) {
        $scope.staffReq = data;
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
        console.log(data);
    });

    // append everything to get it ready for html rendering.
    $scope.table = {
        monday:     [],
        tuesday:    [],
        wednesday:  [],
        thursday:   [],
        friday:     []
    };

    var j = 9;
    for(day in $scope.table){
        $scope.times = [];
        for (var i = 0; i <= 20; i++) {
            var time;
            // hit noon
            if (j % 12 === 0) {
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

            if (i != 0) {
                var temp = function (){
                    if(i % 5 != 0) return "available";
                    return "unavailable";
                };

                $scope.times[i-1] += '-' + time;
                // populate table row
                $scope.table[day].push( { 
                    "time" : $scope.times[i-1], 
                    "availability": temp()
                });
            }
            if (i != 20) {
                $scope.times[i] = time;
            }
        } 
    }
    
    console.log($scope.table);
    
    $scope.number;

    $scope.$watchCollection('[prefix, number]', function(){
        if($scope.prefix != undefined){
            $scope.courses = _.filter($scope.coursesReq, function (courses) { 
                return courses.subject._id === $scope.prefix._id;
            });

            $scope.staff = [];

            for (var i = 0; i < $scope.staffReq.length; i++){
                // if user select just a subject
                if($scope.number == undefined){
                if(_.find($scope.staffReq[i].courses, function(course){return course.subject === $scope.prefix._id})){
                    $scope.staff.push($scope.staffReq[i]);
                }
                }else{  // if user select a course number
                if(_.find($scope.staffReq[i].courses, function(course){return (course.number === $scope.number.number && course.subject === $scope.prefix._id)})){
                    $scope.staff.push($scope.staffReq[i]);
                }   
                }
                for(day in $scope.staffReq.schedule){

                }
            }
        }
        // console.log($scope.staff);
        // console.log(undefined | 1);
    });

    $scope.$watch('prefix', function() {$scope.number = undefined});

});

app.controller('logController', function ($scope, $http) {

    $http.get('/api/log').success(function (data) {
        $scope.logs = data;
    });
});
