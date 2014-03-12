var search = angular.module('search', []);

search.controller('searchController', function ($scope, $http) {

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
        if (!afterNoon) {
            time += 'AM';
        } else {
            time += 'PM';
        }
        if (i != 0) {
            $scope.times[i-1] += ' - ' + time;
        }
        if (i != 20) {
            $scope.times[i] = time;
        }
    }
    
    // Get all of the staff members and courses that are available for
    // tutoring. (don't include courses that has no corresponding tutor).
    $http.get('/api/staff').success(function(data) {

        $scope.staff = data;

        $http.get('/api/courses?expand=location&expand=subject')

        .success(function (data) {
            // If you can find a tutor with a course matching the add it
            // to the courses list.
            // NOTE: The '!!' operator forces a truth value to be returned.
            // This works because underscore 'find' function returns
            // undefined if nothing is found.
            $scope.courses = _.filter(data, function (course) {
                return !!_.find($scope.staff, function (member) {
                    return !!_.find(member.courses, function (staffCourse)  {
                        return course._id  == staffCourse._id;
                    });
                });
            });

            // As a consequence of getting all of the courses, we can also
            // get all of the available subjects.
            $scope.subjects = _.reduce($scope.courses, function(subjects, course) {
                if (!_.find(subjects, function (subject) { 
                    return subject._id == course.subject._id &&
                        subject.location._id == course.location._id; })) {
                    subjects.push(_.extend(course.subject, { 
                        location: course.location }));
                }

                return subjects;
            }, []);
        });
    });

    $scope.selectedCourses = [];

    // Update the course list based on the selected subject and location.
    $scope.updateCourses = function () {

        $scope.schedule = [];
        $scope.showTutors = false;

        // Reset courses if the subject is null.
        if ($scope.subject == null) {
            $scope.selectedCourses = [];
            return;
        }
        // Only get courses which have a matching subject_id and
        // location_id.
        $scope.selectedCourses = _.filter($scope.courses, function (course) {
            return course.subject._id == $scope.subject._id && 
                course.location._id == $scope.subject.location._id;
                 
        });
    };

    $scope.schedule = [];

    // Update the schedule when the selected courses change.
    $scope.updateSchedule = function () {

        $scope.schedule = [];
        $scope.showTutors = false;
        $scope.schedule = _.chain($scope.staff)
        
        // Find all of the staff members that have the given course
        .filter(function (member) {
            return !!_.find(member.courses, function (course) {
                return course._id == $scope.course._id;
            });
        })
        
        // Map each hour of their availability with their id.
        .map(function (member) {
            return [
                _.map(member.schedule.monday, function (hour) {
                    return (hour == 1)? [member._id] : []; }),
                _.map(member.schedule.tuesday, function (hour) {
                    return (hour == 1)? [member._id] : []; }),
                _.map(member.schedule.wednesday, function (hour) {
                    return (hour == 1)? [member._id] : []; }),
                _.map(member.schedule.thursday, function (hour) {
                    return (hour == 1)? [member._id] : []; }),
                _.map(member.schedule.friday, function (hour) {
                    return (hour == 1)? [member._id] : []; })
            ];
        })

        // Combine all of the availabilities into a single 2D array.
        .reduce(function (schedule, days) {
            if (!schedule) {
                return days;
            } else {
                return _.map(days, function (hours, i) { 
                    return _.map(hours, function (available, j) {
                        if (available.length == 1) {
                            return schedule[i][j].concat(available);
                        } else {
                            return schedule[i][j];
                        }
                    });
                });
            }
        })

        .value();
    };

    // Display all of the tutors on the schedule at a igiven time.
    $scope.listTutors = function (i,j) {

        // List tutors only if there are some available.
        if ($scope.schedule[i][j].length == 0) return; 

        $scope.availableTutors = _.map($scope.schedule[i][j], function (tutor_id) {
            return _.find($scope.staff, function (member) {
                return member._id == tutor_id;
            });
        });
        $scope.time = $scope.times[j];
        $scope.day = ['Monday','Tuesday','Wednesday','Thursday','Friday'][i];
        $scope.showTutors = true;
    };

});
