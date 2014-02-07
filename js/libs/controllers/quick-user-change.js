/**
 *  плашка быстрой смены пользователей
 */
function QuickUserChangeCtrl($scope, UserService) {

	// переход на другого пользователя
    $scope.onMoveUserClick = function($event) {
        UserService.getById($scope.nextUser, $scope.onSigninSuccessCallback_);
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        window.location.reload();
    }
}