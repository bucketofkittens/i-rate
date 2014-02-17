/**
 *  плашка быстрой смены пользователей
 */
function QuickUserChangeCtrl($scope, UserService, User, $rootScope) {
	$scope.nextUser = null;

	// переход на другого пользователя
    $scope.onMoveUserClick = function($event) {
        UserService.getById($scope.nextUser, $scope.onSigninSuccessCallback_);
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        window.location.reload();
    }

    // загружаем список пользователей
    $rootScope.$broadcast('usersLoad');
}