var app = angular.module('app', ['ngRoute', 'ngResource', 'app.directives'])
.config(['$routeProvider', 
    function ($routeProvider) { $routeProvider
        .when('/',              { templateUrl: 'partials/index.html' })
        .when('/schedule/:id',  { templateUrl: 'partials/schedule.html' })
        .when('/users',         { templateUrl: 'partials/users.html' })
        .when('/staff',         { templateUrl: 'partials/staff.html' })
        .when('/staff/:id',     { templateUrl: 'partials/singleStaff.html' })
        .when('/help',          { templateUrl: 'partials/help.html' })
        .when('/locations',     { templateUrl: 'partials/locations.html' })
        .when('/subjects',      { templateUrl: 'partials/subjects.html' })
        .when('/courses',       { templateUrl: 'partials/courses.html' })
        .when('/log',           { templateUrl: 'partials/log.html' })
        .otherwise(             { redirectTo: '/' });
}]);

app.controller('schedulerController', [ '$routeParams', '$scope', '$http',

function ($routeParams, $scope, $http) {

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
}]);

// A little $resource helper class that extends the functionality of the
// angular $resource object. It adds the ability of synchronizing client
// data as well as server data, something not in $resource.
app.factory('Resource', ['$http', '$resource', '$q',

function ($http, $resource, $q) {

    var Resource = function (name, methods) { 
        // Define the resource.
        this.name = name;
        this.$resource = $resource('/api/'+name+'/:id', { id: '@_id'}, methods);

        // Current cache of server data. Assume only client to server.
        this.data = this.$resource.query();
    };

    // Define additional actions for Resource. Most return promises due to
    // the nature of resource calls.

    // Find item based by id or get a listing of all items. Returns
    // promise (use .then() and pass callback).
    Resource.prototype.find = function (id) {
       // find and individual staff member
        if (!!id) {
            var defer = $q.defer();

            data.$promise.then(function (items) {
                defer.resolve(_.find(items, function (item) {
                    return item._id == id; 
                }));
            });

            return defer.promise;
        // find all staff members
        } else {
            return data.$promise;
        }
    };


    // Update a item. Denounce protection mean you can spam the crap out
    // of this thing with something like ngChange and the function will at
    // most be executed once per 500 milliseconds.
    Resource.prototype.update = _.debounce(function (item, keys) {
        var defer = $q.defer();
        console.log(keys)

        $http.put('/api/'+this.name+'/'+item._id, _.pick(item, keys))
            .success(function (data, status) {
                console.log('success');
                console.log(data);
                defer.resolve(null,data);
            })
            .error(function (data, status) {
                console.log('failure');
                defer.resolve(data);
            });

        return defer.promise;
    }, 500);

    // Add a new item.
    Resource.prototype.add = function(info) {
        var self = this;
        var item = new this.$resource(info);
        item.$save().then(function () {
            self.data.push(item);
        });
    };

    // Remove an item.
    Resource.prototype.remove = function (item) {
        var self = this;
        var i = self.data.indexOf(item);
        this.data[i].$delete(function () {
            self.data.splice(i, 1);    
        });
    };
    
    return Resource;
}]);

// Basic location controller.
app.service('Locations', ['Resource',

function (Resource) {
    
    return new Resource('locations');

}]);

app.service('Subjects', ['Resource', 

function (Resource) {

    return new Resource('subjects');
    
}]);

app.service('Courses', ['Resource', 

function (Resource) {

    return new Resource('courses');
    
}]);

// Staff service to manage staff member and keep data synced between
// server and client.
app.service('Staff', ['$resource', '$q',  'Resource', 'Locations',

function ($resource, $q, Resource, Locations) {

    // Define the resource.
    var Staff = new Resource('staff', {
        'updateName': { 
            method: 'PUT', 
            transformRequest: function (item) {
                return JSON.stringify(_.pick(item, 'name'));
            },
            transformResponse:  function (item) {
                Locations.data.$promise.then(function (locations) {
                    item.location = _.find(locations, function (obj) {
                        return obj.location == item.location
                    });
                    return item;
                });
            }
        }
    });

    return Staff;

}]);

// A controller to help manage staff members.  You can add/update/delete
// staff members using this controller.  It used the 'Staff' service to
// manage all of the client/server communication.
app.controller("StaffController", ["$scope", "$http", "Staff", "Locations", "Subjects",

function ($scope, $http, Staff, Locations, Subjects) {

    // Get all of the staff member from the server; also group the by
    // their location.
    $scope.staff     = Staff.data;
    $scope.locations = Locations.data;
    $scope.subjects  = Subjects.data;

    $scope.toggle = function(){
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

    // Add a new staff member
    $scope.add = function() { Staff.add($scope.newMember); };
    // Update a staff member
    $scope.update = function (member, keys) { Staff.update(member, keys); };
    // Remove a contact from 
    $scope.remove = function (member) {  Staff.remove(member); };
     
}]);

// A controller to help manage locations.
app.controller('locationController', function ($scope, $http) {
    $http.get('/api/locations').success(function (data) {
        $scope.locations = data;
    });
});

// A controller to help manage locations.
app.controller('LocationController', function ($scope, $http) {
    $http.get('/api/locations').success(function (data) {
        $scope.locations = data;
    });
});

app.controller('SubjectsController', ['$scope', 'Subjects',

function ($scope, Subjects) {

    Subjects.data.$promise.then (function (data) {
        $scope.objects = Subjects.data;
        $scope.keys = [
            { field: 'prefix', editable: true }, 
            { field: 'title', editable: true }, 
        ];
    });

    $scope.update = function (subject, key) { Subjects.update(subject, key); };

}]);

app.controller('CoursesController', ['$scope', 'Courses',

function ($scope, Courses) {

    Courses.data.$promise.then (function (data) {
        $scope.objects = Courses.data;
        $scope.keys = [
            'subject.prefix',
            'subject.title',
            { field: 'number', editable: true },
            { field: 'title', editable: true },
            'location.title'
        ];
    });

    $scope.update = function (course, key) { Courses.update(course, key); };
}]);

app.controller('logController', function ($scope, $http) {

    $http.get('/api/log').success(function (data) {
        $scope.logs = data;
    });
});
