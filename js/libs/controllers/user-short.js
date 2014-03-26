/**
 * Контроллер  профиля
 */
function UserShortController($scope, $location, $rootScope) {
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
        if(message.route == $scope.route) {
            $scope.show = true;
        }
    });

    $scope.$on('hideUserShort', function (event, message) {
        if(message.route == $scope.route) {
            $scope.show = false;
        }
    });

    $scope.$on('$locationChangeSuccess', function(event, newLoc, oldLoc) {
        if(!$location.search()[$scope.route]) {
            $scope.user = null;
        }
    });

    $scope.close = function() {
        $scope.user = null;
        $scope.show = false;

        $rootScope.$broadcast('closeUser', {route: $scope.route});
    }
}