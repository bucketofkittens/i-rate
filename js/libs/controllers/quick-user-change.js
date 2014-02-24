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
        //console.log(data);
        UserService.setAuthData(data);
        window.location.reload();
    }

    // загружаем список пользователей
    $rootScope.$broadcast('usersLoad');
}