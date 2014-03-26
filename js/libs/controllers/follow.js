/**
 * Контроллер панели друзей  
 */
function FollowController($scope, $rootScope) {
    $scope.max = 14;

    if($(window).width() < 500) {
        $scope.max = 6;
    }

	$scope.step = 0;

	$scope.newStep = function(step) {
		$scope.step = step;
	}

    // открываем планшку с пользователем
    $scope.openUser = function(userItem) {
        $rootScope.$broadcast('hideRightPanel');
        $rootScope.$broadcast('closeAllGoals');
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }
}