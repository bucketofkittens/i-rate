/**
 *  плашка быстрой смены пользователей
 */
function QuickUserChangeCtrl($scope, UserService) {
	// переход на другого пользователя
    $scope.onMoveUserClick = function($event, nextUser) {
    	UserService.setAuthData(nextUser);

        window.location.reload();
    }
}