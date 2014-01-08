var app = angular.module('app', ['ngRoute', 'app.directives'])
.config(['$routeProvider', 
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/locations.html'
            }).
            when('/schedule/:id', {
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

app.controller('schedulerController', function ($routeParams, $scope, $http) {

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
        $scope.majors = _.chain(data)
            .filter(function (obj) {
                return obj.location._id === $routeParams.id;
            })
            .groupBy(function (obj) {
                return obj.major.prefix;
            })
            .value();
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

app.controller('locationController', function ($scope, $http) {
    $http.get('/api/locations').success(function (data) {
        $scope.locations = data;
    });
});

app.controller('searchController', function ($scope, $http) {
     
    $http.get('/api/staff').success(function (data) {
        $scope.data = data;
    });

    $scope.$watch('search', function () {
    });

});

app.controller('logController', function ($scope, $http) {

    $http.get('/api/log').success(function (data) {
        $scope.logs = data;
    });
});
