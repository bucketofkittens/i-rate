// контролле панели пользователей
function UsersController($scope, $location) {
	// определяем показываем ли мы панель или нет
	$scope.show = false;

	// событие показа панели с пользователем
	$scope.$on('showUserProfile', function(event, message) {
		// позываем пользователя
		$scope.show = true;

		// указываем переданного пользователя
		if($location.search().user1 && !$location.search().user2) {
        	$location.search({user1: $location.search().user1, user2: message.user.sguid});
		}
		if(!$location.search().user1) {
        	$location.search({user1: message.user.sguid});
		}
    });
}