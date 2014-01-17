var search = angular.module('search', []);

search.controller('searchController', function ($scope, $http) {
    
    $scope.show1 = false;
    $scope.show2 = false;

    $http.get('/api/subjects').success(function (data) {
        $scope.subjects = data;
    });
    
    $http.get('/api/staff').success(function(data) {
        $scope.staffReq = data;
        $scope.staffByLoc = _.groupBy($scope.staff, function (item) { 
            return item.location.title; 
        });
        // console.log(data);
    });

    $scope.number;

    $scope.$watchCollection('[prefix, number]', function(){
       
        $scope.coursesReq = [];

        // get courses that have 1 > tutors 
        _.each($scope.staffReq, function (courses) {
            _.each(courses.courses, function (course) {
                course['course'] = course.number + "\t" + course.title;
                if(_.find($scope.coursesReq, function(c){return c.title == course.title}) === undefined)
                // if(_.find($scope.coursesReq, function(c){return c._id == course._id}) === undefined)
                    $scope.coursesReq.push(course);         
            });
        });

        // sort courses
        $scope.coursesReq = _.sortBy($scope.coursesReq, function(currentObject) { return currentObject.number; });

        // append everything to get it ready for html rendering.
        $scope.week = [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday' ];

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

        $scope.courseTitle = '';

        if($scope.prefix != undefined){
            $scope.show1 = true;
            $scope.courses = _.filter(_.uniq($scope.coursesReq), function (courses) { 
                return courses.subject === $scope.prefix._id;
            });

            $scope.staff = [];

            for (var i = 0; i < $scope.staffReq.length; i++){
                // if user select just a subject
                if($scope.number == undefined){
                if(_.find($scope.staffReq[i].courses, function(course){return course.subject === $scope.prefix._id})){
                    $scope.staff.push($scope.staffReq[i]);
                    for(day in $scope.staffReq[i].schedule){
                    for(var obj = 0; obj < $scope.table[day].length;obj++){
                        //$scope.table[day][obj]['tutors'] = [];
                        if($scope.staffReq[i].schedule[day][obj] === 1 ){
                            $scope.table[day][obj]['schedule'] = "available";
                            $scope.table[day][obj]['tutors'].push({
                                name: $scope.staffReq[i].name,
                                location: $scope.staffReq[i].location
                            });
                        }else if ($scope.staffReq[i].schedule[day][obj] === 0 &&
                            $scope.table[day][obj]['schedule'] === "available"){
                            $scope.table[day][obj]['schedule'] = "available";
                        }else{
                            $scope.table[day][obj]['schedule'] = "unavailable";
                        }
                    }
                }
                }
                }else{  // if user select a course number
                if(_.find($scope.staffReq[i].courses, function(course){return (course.number === $scope.number.number && course.subject === $scope.prefix._id)})){
                    $scope.courseTitle = $scope.number.title;
                    $scope.staff.push($scope.staffReq[i]);
                    for(day in $scope.staffReq[i].schedule){
                    for(var obj = 0; obj < $scope.table[day].length;obj++){
                        //$scope.table[day][obj]['tutors'] = [];
                        if($scope.staffReq[i].schedule[day][obj] === 1 ){
                            $scope.table[day][obj]['schedule'] = "available";
                            $scope.table[day][obj]['tutors'].push({
                                name: $scope.staffReq[i].name,
                                location: $scope.staffReq[i].location
                            });
                        }else if ($scope.staffReq[i].schedule[day][obj] === 0 &&
                            $scope.table[day][obj]['schedule'] === "available"){
                            $scope.table[day][obj]['schedule'] = "available";
                        }else{
                            $scope.table[day][obj]['schedule'] = "unavailable";
                        }
                    }
                }
                }   
                }
            }
        }
    });

    $scope.$watch('prefix', function() {$scope.number = undefined;});

    $scope.showTutor = function(hour, day) {
        if(hour.tutors.length > 0){ 
            $scope.time = day + ' ' + hour.time;
            $scope.tutors = hour;
            $scope.show2 = true;
            $scope.show1 = false;
        }
    };

    $scope.showTable = function () {
    
        $scope.show2 = false;
        $scope.show1 = true;
    };
});
