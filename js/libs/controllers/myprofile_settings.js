// контроллер вкладки настроки своего профиля
function MyProfileSettingsController($scope, UserService, SocialService, FriendsService, TokenService, $rootScope, $location, SocialService, CityService, ProfessionsService) {
	$scope.city = [];

	$scope.profession = [];

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

    $scope.cityByStateCallback_ = function(data, key) {
    	$scope.city = data;
    }

    $scope.deleteCityItemCallback_ = function(data, key) {
    	$scope.city.splice(key, 1);
    }

    $scope.deleteCityItem = function($event, item, key) {
        CityService.remove(item.sguid, key, $scope.deleteCityItemCallback_);
    }

    $scope.getProfessionsByCareerCallback_ = function(data) {
    	$scope.profession = data;
    }

    $scope.selectCurrentCity = function($event, item, key) {
        $scope.workspace.user.city = {
        	sguid: item.sguid,
        	name: item.name
        };
        $scope.updateUser();  
    }

    $scope.selectCareer = function($event, career) {
    	ProfessionsService.getProfessionsByCareer(career.sguid, $scope.getProfessionsByCareerCallback_);
    }

    $scope.updateUserCallback_ = function(data) {
    	if(data.success) {
            $scope.nameIsError = false;
            UserService.setAuthData($scope.workspace.user);
        } else {
            var isName = false;
            angular.forEach(data.errors, function(value, key){
                if(value == 'name: ["is already taken"]') {
                    isName = true;
                }
            });
            if(isName) {
                $scope.nameIsError = true;
            } else {
                $scope.nameIsError = false;
            }
        }
    }

    $scope.updateUserByParam = function(name, value) {
    	var user = {};
    	user[name] = value;
    	UserService.update($scope.workspace.user.sguid, user, $scope.updateUserCallback_);
    }

    // определяем заходили ли мы через социальную сеть
    $scope.social = SocialService.getCurrentSocial();
}