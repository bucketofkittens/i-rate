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
		$location.search({});
	}

	// открываем эту плашку
	$scope.$on('openProfile', function(event, message) {
		$location.search({ myprofile: true});
    });

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event) {
        if($location.search().myprofile) {
        	$scope.showProfile = true;

        	if(!$location.search().nav) {
				var cacheNav = lscache.get($scope.cacheName) ? lscache.get($scope.cacheName) : $scope.indexes.PROFILE;
				$location.search({ myprofile: true, nav: cacheNav});
			} else {
				$scope.setCurrentNav($scope.getIndexByName($location.search().nav));

				lscache.set($scope.cacheName, $scope.currentNav.name, $scope.cacheTime);	
			}
        } else {
        	$scope.showProfile = false;
        }
    });
}