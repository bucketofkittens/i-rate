function MyProfileProfileController($scope, $rootScope, $location, LocationService) {

	// название кеша
   	$scope.cacheName = 'myprofilecurrentgoal';

    // время кеширования
    $scope.cacheTime = 1440;

	// открываем список голсов справа
	$scope.goalClick = function($event, needItem, goalItem, needs) {
		$scope.persistState(needItem, goalItem);

		$rootScope.$broadcast('openCriteriumList', {need: needItem, goal: goalItem, needs: needs});

		LocationService.update("goal", goalItem.name);
	}

	$scope.persistState = function(needItem, goalItem) {
		lscache.set($scope.cacheName, JSON.stringify({need: needItem, goal: goalItem}), $scope.cacheTime);
	}

	// событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event) {
        if($location.search().goal) {
        	$scope.moveToGoal($location.search().goal);
        } else {
        	$scope.moveToFirstGoal($location.search().goal);
        }
    });

    $scope.moveToGoal = function(goalName) {
    	angular.forEach($scope.workspace.needs, function(value, key){
    		angular.forEach(value.goals, function(goalItem, goalKey){
    			if(goalItem.name == goalName) {
    				goalItem.current = true;
    				$rootScope.$broadcast('openCriteriumList', {need: value, goal: goalItem, needs: $scope.needs});
    			}
    		});
    	});
    }

    $scope.moveToFirstGoal = function(goalName) {
    	var goalItem = $scope.workspace.needs[0].goals[0];
    	goalItem.current = true;
    	$scope.goalClick({}, $scope.workspace.needs[0], goalItem, $scope.needs);
    }

    if($location.search().goal) {
    	$scope.moveToGoal($location.search().goal);
    } else {
    	$scope.moveToFirstGoal($location.search().goal);
    }
}