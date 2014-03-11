var app = angular.module('app', ['ngRoute', 'ngResource', 'app.directives'])
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

    $scope.staff = [];

    $scope.saveAll = function () {
        var schedule = _.map($scope.staff, function (member) {
            return {
                _id: member._id,
                schedule: member.schedule
            };
        });
        console.log(schedule);
        $http.put('/api/staff', schedule);
    };

    $http.get('/api/staff').success(function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].schedule.monday.length === 0) {
                data[i].schedule.monday = Array(20);
                data[i].schedule.tuesday = Array(20);
                data[i].schedule.wednesday = Array(20);
                data[i].schedule.thursday = Array(20);
                data[i].schedule.friday = Array(20);
            }
            data[i].total = _.reduce(_.flatten(_.values(data[i].schedule)), function (memo, num) {
                return memo + num;
            }, 0);
        }
        $scope.staff = _.filter(data, function (obj) {
            return obj.location._id === $routeParams.id;
        })
        $scope.majors = _.groupBy($scope.staff, function (obj) {
                return obj.major.prefix;
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

app.service('Staff', ['$resource', '$q', function ($resource, $q) {
    
    var Staff = $resource('/api/staff/:id',
        { id: '@_id'}, 
        {
            'updateName': { 
                method: 'PUT', 
                transformRequest: function (item) {
                    return JSON.stringify(_.pick(item, 'name'));
                }
            }
        }
    ); 
    
    var query = Staff.query();

    return {
        find: function (id) {
            // find and individual staff member
            if (!!id) {
                var defer = $q.defer();

                query.$promise.then(function (items) {
                    defer.resolve(_.find(items, function (item) {
                        return item._id == id; 
                    }));
                });

                return defer.promise;
            // return everybody
            } else {
                return query.$promise;
            }
        }
    };  
}]);

// A controller to help manage staff members.
// You can add/update/delete staff members using this controller.
// It used the 'Staff' service to manage all of the client/server
// communication.
app.controller("StaffController",function ($scope, $http, Staff) {

    // Get all of the staff member from the server; also group the by
    // their location.
    Staff.find().then(function (staff) {
        $scope.staff = staff;
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
    });

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

    $scope.$watch('staff', function () {
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
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

    $scope.updateStaff = _.debounce(function (staff) {
        staff.$updateName();
        console.log(staff);
    }, 1500);
     
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
    
    $http.get('/api/subjects').success(function (data) {
        $scope.subjects = data;
    });
    
    $http.get('/api/courses').success(function (data) {
        $scope.coursesReq = data;
        // console.log(data);
    });

    $http.get('/api/staff').success(function(data) {
        $scope.staffReq = data;
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
    });
    
    $scope.number;

    $scope.$watchCollection('[prefix, number]', function(){
       
        // append everything to get it ready for html rendering.
        $scope.table = {
            monday:     [],
            tuesday:    [],
            wednesday:  [],
            thursday:   [],
            friday:     []
        };

        
        for(day in $scope.table){
            var j = 9;
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
                    // var temp = function (){
                    //     if(i % 5 != 0) return "available";
                    //     return "unavailable";
                    // };

                    $scope.times[i-1] += '-' + time;
                    // populate table row
                    $scope.table[day].push( { 
                        "id": i-1,
                        "time" : $scope.times[i-1], 
                        "tutors" : []
                        //"availability": temp()
                    });
                }
                if (i != 20) {
                    $scope.times[i] = time;
                }
            } 
        }

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
                    for(day in $scope.staffReq[i].availability){
                    for(var obj = 0; obj < $scope.table[day].length;obj++){
                        //$scope.table[day][obj]['tutors'] = [];
                        if($scope.staffReq[i].availability[day][obj] === 1 ){
                            $scope.table[day][obj]['availability'] = "available";
                            $scope.table[day][obj]['tutors'].push($scope.staffReq[i].name);
                        }else if ($scope.staffReq[i].availability[day][obj] === 0 &&
                            $scope.table[day][obj]['availability'] === "available"){
                            $scope.table[day][obj]['availability'] = "available";
                        }else{
                            $scope.table[day][obj]['availability'] = "unavailable";
                        }
                    }
                }
                }
                }else{  // if user select a course number
                if(_.find($scope.staffReq[i].courses, function(course){return (course.number === $scope.number.number && course.subject === $scope.prefix._id)})){
                    $scope.staff.push($scope.staffReq[i]);
                    for(day in $scope.staffReq[i].availability){
                    for(var obj = 0; obj < $scope.table[day].length;obj++){
                        //$scope.table[day][obj]['tutors'] = [];
                        if($scope.staffReq[i].availability[day][obj] === 1 ){
                            $scope.table[day][obj]['availability'] = "available";
                            $scope.table[day][obj]['tutors'].push($scope.staffReq[i].name);
                        }else if ($scope.staffReq[i].availability[day][obj] === 0 &&
                            $scope.table[day][obj]['availability'] === "available"){
                            $scope.table[day][obj]['availability'] = "available";
                        }else{
                            $scope.table[day][obj]['availability'] = "unavailable";
                        }
                    }
                }
                }   
                }
            }
        }
    });

    $scope.$watch('prefix', function() {$scope.number = undefined});

});

app.controller('logController', function ($scope, $http) {

    $http.get('/api/log').success(function (data) {
        $scope.logs = data;
    });
});
