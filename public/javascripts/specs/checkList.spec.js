describe("A checklist", function() {

    var $scope, scope, el;
 
    // load application
    beforeEach(angular.mock.module('app'));

    // load templates
    beforeEach(angular.mock.module('/partials/checkList.html'));

    // compile variables from directive
    beforeEach(angular.mock.inject(function ($compile, $rootScope) {
        el = angular.element('<div mask="mask" list="list" check-list></div>');
        scope = $rootScope.$new();
        scope.list = [0,0,0,0];
        scope.mask = [1,1,1,0];
        $compile(el)(scope);
        scope.$digest();

        // for testing scope within directive
        $scope = el.isolateScope();    
    }));

    // tests

    it('should have as many items as the \'list\' perameter.', function () {
        expect(el.find('li').length).toBe(4);
    });

    it('should be disableable based on \'mask\' perameter.', function () {
        // disabled check based on mast variable
        var check = el.find('li').find('span').eq(3);
        expect(check.hasClass('check-disabled')).toBe(true);
        expect(scope.list[3]).toBe(0);
        check.click();
        expect(check.hasClass('check-disabled')).toBe(true);
        expect(scope.list[3]).toBe(0);
    });

    it('should change item state on click.', function () {
        var check = el.find('li').find('span').eq(0);
        expect(check.hasClass('check-false')).toBe(true);
        expect(scope.list[0]).toBe(0);
        check.click();
        expect(check.hasClass('check-true')).toBe(true);
        expect(scope.list[0]).toBe(1);
    });
});
