function UsersController($scope, $location) {
	// определяем показываем ли мы панель или нет
	$scope.show = false;

	// событие показа панели с пользователем
	$scope.$on('showUserProfile', function(event, message) {
		$scope.show = true;
        $location.search({user1: message.user.sguid});
    });
}