function MyProfileController($scope) {
	$scope.showProfile = false;

	$scope.nav = [
		{
			name: 'Profile',
			index: 1
		},
		{
			name: 'Dashboard',
			index: 2
		},
		{
			name: 'Settings',
			index: 3
		}
	];

	$scope.indexes = {
		PROFILE: 1,
		DASHBOARD: 2,
		SETTINGS: 3
	}

	$scope.currentNav = $scope.nav[0];

	$scope.changeState = function(state) {
		$scope.currentNav = state;
	}

	$scope.$on('openProfile', function(event, message) {
        $scope.showProfile = true;
        console.log($scope.showProfile);
    });
}