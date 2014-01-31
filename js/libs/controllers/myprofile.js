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

	// текущий выбранный элемент
	$scope.currentNav = $scope.navItems[0];

	// выбираем другое состояние
	$scope.changeState = function(state) {
		$scope.currentNav = state;
	}

	// закрываем плашку
	$scope.close = function() {
		$scope.showProfile = false;
	}

	// открываем эту плашку
	$scope.$on('openProfile', function(event, message) {
        $scope.showProfile = true;
    });
}