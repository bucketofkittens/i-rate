/**
 *  плашка быстрой смены пользователей
 */
function QuickUserChangeCtrl($scope, UserService, User, $rootScope, SessionsService, TokenService) {
	$scope.nextUser = null;

    $scope.$watch('nextUser', function (newVal, oldVal, scope) {
        
    });

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

        if(data.birthday) {
            data.birthday = new Date(data.birthday);    
        }
        
        $scope.workspace.user = data;

        $rootScope.$broadcast('quckUpdateUser');
    }

    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }

    // загружаем список пользователей
    $rootScope.$broadcast('usersLoad');
}