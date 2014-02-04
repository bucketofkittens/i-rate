// контроллер вкладки настроки своего профиля
function MyProfileSettingsController($scope, UserService, SocialService, FriendsService, TokenService, $rootScope) {

	// выходим из пользователя
	$scope.onLogout = function() {
		// убиваем токен
		TokenService.remove();

		// убираем данные о пользователе из кеша
		UserService.clearAuthData();

		// убираем зписить из кеша о социалках
		SocialService.clear();

		// удаляем пользователя из scope
		$scope.workspace.user = null;

		// забираем список друзей для не авторизованного пользователя
		$scope.workspace.friends = FriendsService.getList();
	}

	// открываем модальное окно манипуляций с картинками
	$scope.onReadFile = function($event) {
        $rootScope.$broadcast('cropImage');
    }
}