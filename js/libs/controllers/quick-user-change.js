/**
 *  плашка быстрой смены пользователей
 */
function QuickUserChangeCtrl($scope, UserService, User, $rootScope, SessionsService, TokenService) {
	$scope.nextUser = null;

	// переход на другого пользователя
    $scope.onMoveUserClick = function($event) {
        SessionsService.signin({
                "email": $scope.nextUser, 
                "password": "",
                "from_improva": "1"
            },
            $scope.onSigninSuccessCallback_
        );
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);
        $scope.workspace.user = data;
    }

    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }

    // загружаем список пользователей
    $rootScope.$broadcast('usersLoad');
}