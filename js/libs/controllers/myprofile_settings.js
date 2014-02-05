// контроллер вкладки настроки своего профиля
function MyProfileSettingsController($scope, UserService, SocialService, FriendsService, TokenService, $rootScope, $location, SocialService, CityService) {
	$scope.city = [];

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

		// скрываем окошко профиля
		$rootScope.$broadcast('closeProfile');

		// скрываем подложную тенюшку
		$rootScope.$broadcast('hideShadow');
	}

	// открываем модальное окно манипуляций с картинками
	$scope.onReadFile = function($event) {
        $rootScope.$broadcast('cropImage');
    }

    // переход на страницу смены пароля
    $scope.onChangePassword = function() {
        $location.search({ change_password: true });
    }

    $scope.cityByState = function($event, state) {
    	CityService.getCityByState(state.sguid, $scope.cityByStateCallback_);
    }

    $scope.cityByStateCallback_ = function(data) {
    	$scope.city = data;
    }

    // определяем заходили ли мы через социальную сеть
    $scope.social = SocialService.getCurrentSocial();
}