// контроллер вкладок своего профиля
function MyProfileController($scope, $location) {
	// показываем плашку или нет
	$scope.showProfile = false;

	// пункты меню навигации
	$scope.navItems = [
		{
			name: 'Profile'
		},
		{
			name: 'Dashboard'
		},
		{
			name: 'Settings'
		}
	];

	// список индексов
	$scope.indexes = {
		PROFILE: 'Profile',
		DASHBOARD: 'Dashboard',
		SETTINGS: 'Settings'
	}

	// название кеша
   	$scope.cacheName = 'myprofiletab';

    // время кеширования
    $scope.cacheTime = 1440;

	// устанавливаем текущий пункт навигации
	$scope.setCurrentNav = function(index) {
		$scope.clearNav();

		$scope.navItems[index].current = true;
		$scope.currentNav = $scope.navItems[index];

		$location.search({myprofile: true, nav: $scope.currentNav.name});
	}

	// забираем индекс эелмента по полю name
	$scope.getIndexByName = function(name) {
		var idx = 0;
		angular.forEach($scope.navItems, function(value, key){
			if(value.name == name) {
				idx = key
			}
		});

		return idx;
	}

	// очищаем все пункты навигации от current
	$scope.clearNav = function() {
		angular.forEach($scope.navItems, function(value, key){
			value.current = false;
		});
	}
	
	// выбираем другое состояние
	$scope.changeState = function(state) {
		$scope.setCurrentNav(state);
	}

	// закрываем плашку
	$scope.close = function() {
		$scope.showProfile = false;
	}

	// открываем эту плашку
	$scope.$on('openProfile', function(event, message) {
		$scope.getPersistTab();

        $scope.showProfile = true;
    });

	// По указанному пути выбираем нужный элемент меню
   	$scope.setCurrentNavByLocation = function() {
   		var nav = $location.search().nav ? $location.search().nav : $scope.indexes.PROFILE;

   		$scope.setCurrentNav($scope.getIndexByName(nav));
   	}

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function () {
        if($location.search().myprofile) {
        	$scope.showProfile = true;
        	$scope.setCurrentNavByLocation();
        } else {
        	$scope.showProfile = false;
        }
    });
}