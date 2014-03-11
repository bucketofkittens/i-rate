function ConfirmController($scope, ConfirmSignup, $routeParams, $rootScope, $location) {
    ConfirmSignup.test({hash: $routeParams.hash}, {}, function(data) {
        $rootScope.$broadcast('openModal', {name: "confirm-success"});
        $location.path("/");
    });
}