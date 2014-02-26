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
        if(data.birthday) {
            data.birthday = new Date(data.birthday);    
        }
        
        UserService.setAuthData(data);
        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);
        
        $scope.workspace.user = data;

        $rootScope.$broadcast('quckUpdateUser');
    }

    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }

    // загружаем список пользователей
    $rootScope.$broadcast('usersLoad');
}