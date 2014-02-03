function MyProfileProfileController($scope, $rootScope, $location, LocationService) {

	// название кеша
   	$scope.cacheName = 'myprofilecurrentgoal';

    // время кеширования
    $scope.cacheTime = 1440;

	// открываем список голсов справа
	$scope.goalClick = function($event, needItem, goalItem, needs) {
        if(!goalItem.current) {
            $rootScope.$broadcast('openCriteriumList', {need: needItem, goal: goalItem, needs: needs});
            $scope.pesistState(goalItem.name);
        
            LocationService.update("goal", goalItem.name);    
        }
	}

    // сохраняем состояние goal в кеш
    $scope.pesistState = function(goalName) {
        lscache.set($scope.cacheName, goalName, $scope.cacheTime);
    }

	// событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event) {
        $scope.selectGoal();
    });

    // переход по goal по указанному location
    $scope.moveToGoal = function(goalName) {
        // перебираем все нидсы и голсы в поисках нужного
    	angular.forEach($scope.workspace.needs, function(value, key){
    		angular.forEach(value.goals, function(goalItem, goalKey){
    			if(goalItem.name == goalName) {
    				goalItem.current = true;
    				$rootScope.$broadcast('openCriteriumList', {need: value, goal: goalItem, needs: $scope.needs});
    			} else {
                    goalItem.current = false;
                }
    		});
    	});
    }

    // выбираем первый элемент
    $scope.moveToFirstGoal = function() {
    	var needItem = $scope.workspace.needs[0];
    	var goalItem = needItem.goals[0];

    	goalItem.current = true;
    	$scope.goalClick({}, $scope.workspace.needs[0], goalItem, $scope.needs);
    }

    // выбираем нружный goal по текущему location
    $scope.selectGoal = function() {
	    if($location.search().goal) {
	    	$scope.moveToGoal($location.search().goal);
            $scope.pesistState($location.search().goal);
	    } else {
	    	var goalName = lscache.get($scope.cacheName);
	    	if(goalName) {
	    		$scope.moveToGoal(goalName);
	    	} else {
	    		$scope.moveToFirstGoal();
	    	}
            LocationService.update("goal", goalName);
	    }
    }

    // выбираем location
    $scope.selectGoal();
}