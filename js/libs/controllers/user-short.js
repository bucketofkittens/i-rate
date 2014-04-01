/**
 * Контроллер  профиля
 */
function UserShortController($scope, $location, $rootScope, FriendsService) {
    // данные пользователя
    $scope.user = null;

    $scope.show = false;

    $scope.tab = 1;

    $scope.phoneNeedsShow = false;

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

    $scope.onChangeTab = function(tab) {
        $scope.tab = tab;
        $rootScope.$broadcast('changeTab', {tab: tab, route: $scope.route});
    }

    $scope.close = function() {
        $scope.user = null;
        $scope.show = false;

        $rootScope.$broadcast('closeUser', {route: $scope.route});
    }

    $scope.changeStatePhoneNeed = function() {
        $scope.phoneNeedsShow = !$scope.phoneNeedsShow;

        $rootScope.$broadcast('stateShowUser', {state: $scope.phoneNeedsShow, route: $scope.route});
    }

    /** Событие добавление в друзья */
    $scope.onFollow = function() {
        if($scope.workspace.user) {
            FriendsService.follow($scope.user, $scope.workspace.friends, $scope.followCallback_);    
        }
    }

    /** Событие удаление из друзей */
    $scope.onUnFollow = function() {
        if($scope.workspace.user) {
            FriendsService.unfollow($scope.user, $scope.workspace.friends, $scope.unfollowCallback_);
        }
    }

    // callback после добавления пользователя в друзья
    $scope.followCallback_ = function(friends) {
        $scope.workspace.friends = friends;
        $scope.isFriend = true;
        $scope.user.likes += 1;
    }

    // callback после удаления пользователя из друзей
    $scope.unfollowCallback_ = function(friends) {
        $scope.workspace.friends = friends;
        $scope.isFriend = false;
        $scope.user.likes -= 1;
    }
}