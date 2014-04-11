/**
 * Контроллер панели друзей  
 */
function FollowController($scope, $rootScope) {
    $scope.max = 14;
    $scope.stepWidth = 48;

    if($scope.phone) {
        $scope.max = 6;
        $scope.stepWidth = 38;
    }

	$scope.step = 0;

    alert($scope.workspace.friends.length);

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