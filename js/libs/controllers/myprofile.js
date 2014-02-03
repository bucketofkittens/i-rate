// контроллер вкладок своего профиля
function MyProfileController($scope) {
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

	// устанавливаем текущий пункт навигации
	$scope.setCurrentNav = function(index) {
		$scope.clearNav();

		$scope.navItems[index].current = true;
		$scope.currentNav = $scope.navItems[index];
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
        $scope.showProfile = true;
    });

	// вначале выбираем первый пункт меню
    $scope.setCurrentNav(0);
}