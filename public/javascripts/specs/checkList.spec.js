describe("An checkList", function() {

    var el, scope;

    // load the app
    beforeEach(module('app'));

    // load the template file
    beforeEach(module('partials/checkList.html'));

    beforeEach(inject(function ($rootScope, $compile) {
        el = angular.element(
            '<div list="stubList" check-list>Title</div>'
        );
        scope = $rootScope;
        scope.stubList = Array(5);
        $compile(el)(scope);
        scope.$digest();
    }));

    // expect after each
    afterEach(function () {});

    // an expected behavior
    it("should create 5 list elements.", function() {
        var ol  = elm.find('ol');
        expect(ol.length).toBe(5);
    });

});
