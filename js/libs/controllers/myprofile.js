// контроллер вкладок своего профиля
function MyProfileController($scope, $location, LocationService, $rootScope, $timeout) {
	// показываем плашку или нет
	$scope.showProfile = false;

	// пункты меню навигации
	$scope.navItems = [
		{
			name: 'Profile'
		},
		{
			name: 'Settings'
		}
	];

	// список индексов
	$scope.indexes = {
		PROFILE: 'Profile',
		SETTINGS: 'Settings'
	}

	// название кеша
   	$scope.cacheName = 'myprofiletab';

    // время кеширования
    $scope.cacheTime = 1440;

	// устанавливаем текущий пункт навигации
	$scope.setCurrentNav = function(index, move) {
		$scope.clearNav();

		$scope.navItems[index].current = true;
		$scope.currentNav = $scope.navItems[index];

		LocationService.update("nav", $scope.currentNav.name);
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
		$location.search({ myprofile: true, nav: $scope.currentNav.name});
	}

	// закрываем плашку
	$scope.close = function() {
		$location.search({});
	}

	// открываем эту плашку
	$scope.$on('openProfile', function(event, message) {
		if(message && message.nav) {
			$location.search({ myprofile: true, nav: message.nav });
		} else {
			$location.search({ myprofile: true });
		}
    });

    // скрываем эту плашку
	$scope.$on('closeProfile', function(event, message) {
		$location.search({});
    });

    $scope.updateProfileState = function() {
    	if($location.search().myprofile) {
        	$scope.showProfile = true;
            
            $rootScope.$broadcast('careersLoad');
            
            $rootScope.$broadcast('professionsLoad');

        	// проверяем существование nav в location
        	if(!$location.search().nav) {

        		// если его нет, берем его из кеша и переходим на нужный таб
				var cacheNav = lscache.get($scope.cacheName) ? lscache.get($scope.cacheName) : $scope.indexes.PROFILE;
				$location.search({ myprofile: true, nav: cacheNav});
			} else {
				// если есть переходим на таб и записываем в кеш новое состояниеы
				$scope.setCurrentNav($scope.getIndexByName($location.search().nav));
				lscache.set($scope.cacheName, $scope.currentNav.name, $scope.cacheTime);
			}
        } else {
        	$scope.showProfile = false;
        }
    }

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event) {
        $scope.updateProfileState();
    });

    $scope.$watch("workspace.user", function (newVal, oldVal, scope) {
    	if(newVal) {
    		$scope.updateProfileState();	
    	}
    });

    // загружаем список нидсов
    $rootScope.$broadcast('needsLoad');
}