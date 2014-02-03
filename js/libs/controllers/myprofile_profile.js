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
        $scope.selectGoal();
    });

    // переход по goal по указанному location
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

    // выбираем первый элемент
    $scope.moveToFirstGoal = function(goalName) {
    	var needItem = $scope.workspace.needs[0];
    	var goalItem = needItem.goals[0];

    	goalItem.current = true;
    	$scope.goalClick({}, $scope.workspace.needs[0], goalItem, $scope.needs);
    }

    // выбираем нружный goal по текущему location
    $scope.selectGoal = function() {
	    if($location.search().goal) {
	    	$scope.moveToGoal($location.search().goal);
	    } else {
	    	$scope.moveToFirstGoal($location.search().goal);
	    }
    }

    // выбираем location
    $scope.selectGoal();
    
}