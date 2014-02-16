/**
 *  плашка быстрой смены пользователей
 */
function QuickUserChangeCtrl($scope, UserService, User) {
	$scope.nextUser = null;
	$scope.usersList = [];

	User.get_all({}, {}, function(data) {
		angular.forEach(data, function(value, key){
			value.title = value.name ? value.login + ", " + value.name : value.login;
		});
		$scope.usersList = data;
	});

	// переход на другого пользователя
    $scope.onMoveUserClick = function($event) {
    	console.log($scope);
        UserService.getById($scope.nextUser, $scope.onSigninSuccessCallback_);
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        window.location.reload();
    }
}