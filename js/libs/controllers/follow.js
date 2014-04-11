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
    $scope.position = $scope.step+$scope.max;
    $scope.size = 0;

    $scope.$watch('workspace.friends', function (newVal, oldVal, scope) {
        if(newVal) {
            $scope.size = $scope.workspace.friends.length;
        }
    });

	$scope.newStep = function(step) {
		$scope.step = step;

        $scope.position = $scope.step+$scope.max;
	}

    // открываем планшку с пользователем
    $scope.openUser = function(userItem) {
        $rootScope.$broadcast('hideRightPanel');
        $rootScope.$broadcast('closeAllGoals');
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }
}