function MyProfileProfileController($scope, $rootScope, $location, LocationService, NeedsService) {

	// название кеша
   	$scope.cacheName = 'myprofilecurrentgoal';

    // время кеширования
    $scope.cacheTime = 1440;

    // выбранный нид
    $scope.selectedNeed = null;

    // выбранный гоалс
    $scope.selectedGoal = null;

    // сохраняем состояние goal в кеш
    $scope.pesistState = function(goalName) {
        lscache.set($scope.cacheName, goalName, $scope.cacheTime);
    }

	// событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event) {
        //$scope.selectGoal();
    });

    // переход по goal по указанному location
    $scope.moveToGoal = function(goalName) {
        // перебираем все нидсы и голсы в поисках нужного
    	angular.forEach($scope.needs, function(value, key) {
    		angular.forEach(value.goals, function(goalItem, goalKey) {
                if(goalItem.name == goalName) {
                    goalItem.current = true;
                    $scope.$parent.getCriteriumByGoal(goalItem);

                    $scope.selectedNeed = value;
                    $scope.selectedGoal = goalItem;
                    
                } else {
                    goalItem.current = false;
                }
    		});
    	});
    }

    // выбираем нружный goal по текущему location
    $scope.selectGoal = function() {
	    if($location.search().goal && $scope.needs) {
	    	$scope.moveToGoal($location.search().goal)
	    } else {
	    	var goalName = lscache.get($scope.cacheName);
	    	if(!goalName) {
                //$scope.moveToFirstGoal();
	    	}
            LocationService.update("goal", goalName);
	    }
    }

    // открываем список голсов справа
    $scope.goalClick = function($event, goalItem, needs, need) {
        if(!goalItem.current) {
            // закрываем все нидсы
            needs = NeedsService.closeAllGoals(needs);

            $scope.$parent.getCriteriumByGoal(goalItem);
            $scope.pesistState(goalItem.name);
        
            LocationService.update("goal", goalItem.name);
            goalItem.current = true;

            $scope.selectedNeed = need;
            $scope.selectedGoal = goalItem;
        }
    }

    $scope.$watch('needs', function (newVal, oldVal, scope) {
        if(newVal) {
            $scope.selectGoal();
        }
    });

    $scope.selectGoal();
}