/**
 * Контроллер  профиля
 */
function UserShortController($scope, $location) {
    // данные пользователя
    $scope.user = null;

    $scope.show = false;

    $scope.init = function(route) {
        $scope.route = route;
    }

    $scope.$on('userGetById', function (event, message) {
        if(message.route == $scope.route) {
            $scope.user = message.user;
        }
    });

    $scope.$on('showUserShort', function (event, message) {
        console.log(message.route);
        if(message.route == $scope.route) {

            $scope.show = true;
        }
    });

    $scope.$on('hideUserShort', function (event, message) {
        if(message.route == $scope.route) {
            $scope.show = false;
        }
    });

    $scope.close = function() {
        $scope.user = null;
        $scope.show = false;
        $location.search($scope.route, null);
        $rootScope.$broadcast('closeUserPanel', {route: $scope.route});
    }
}