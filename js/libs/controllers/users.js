// контролле панели пользователей
function UsersController($scope, $location, $rootScope, $timeout, NeedsService, LocationService, User) {
    // список значений нидсов для пользователя
    $scope.needsValues = {};

    // список значений голсов для пользователя
    $scope.goalsValues = {};

    // список открытых критериев
    $scope.openGoals = {};

    // значения критериев
    $scope.criteriumsValues = {};

	// определяем показываем ли мы панель или нет
	$scope.show = $location.search().user1 || $location.search().user2 ? true : false;

	// закрываем правую панель. Грязный хак. нужно будет переписать когда пойму как.
	if($scope.show) {
		$timeout(function(){
			$rootScope.$broadcast('hideRightPanel');
		}, 0);
	}

    // событие загрузки цифр для колбас для needs
    $scope.$on('toggleCriteria', function (event, message) {
        if(message.state) {
            $scope.openGoals[message.goalItem.sguid] = message.goalItem;    
        } else {
            delete $scope.openGoals[message.goalItem.sguid];
        }
        
    });

    // событие загрузки цифр для колбас для needs
    $scope.$on('needUserValueLoaded', function (event, message) {
        if($location.search().user1 || !$location.search().user2) {
            $scope.needsValues = $scope.calculateValue(message.needsValues, $scope.needsValues, message.route);
        }
    });

    // событие загрузки цифр для колбас для needs
    $scope.$on('goalUserValueLoaded', function (event, message) {
        if($location.search().user1 || !$location.search().user2) {
            $scope.goalsValues = $scope.calculateValue(message.goalsValues, $scope.goalsValues, message.route);
        }
    });

    // событие загрузки цифр для колбас для needs
    $scope.$on('criteriaUserValueLoaded', function (event, message) {
        if($location.search().user1 || !$location.search().user2) {
            if(!$scope.criteriumsValues[message.fCriteria.sguid]) {
                $scope.criteriumsValues[message.fCriteria.sguid] = {};
            }

            var fCriteriumValue = message.fCriteria.criteria_values.filter(function(value) {
                return value.sguid == message.fCriteria.user_criteria_sguid;
            })[0];

            if(fCriteriumValue) {
                $scope.criteriumsValues[message.fCriteria.sguid][message.route] = fCriteriumValue.value;     
            }
        }
    });

    // событие закрытия панели с пользователем
    $scope.$on('closeUserPanel', function (event, message) {
        $scope.needsValues = $scope.clearRoute($scope.needsValues, message.route);
        $scope.goalsValues = $scope.clearRoute($scope.goalsValues, message.route);
        $scope.criteriumsValues = $scope.clearRoute($scope.criteriumsValues, message.route);

        if(!$location.search().user1 && $location.search().user2) {
            $location.search({user1: $location.search().user2});
        }
    });

    // строим массив значений
    $scope.calculateValue = function(data, beginData, route) {
        angular.forEach(data, function(value, key){
            if(!beginData[key]) {
                beginData[key] = {};
            }
            beginData[key][route] = value;
        });

        return beginData;
    }

    // удаляем из массива значений значения для указанного роутинга
    $scope.clearRoute = function(beginData, route) {
        angular.forEach(beginData, function(value, key){
            if(value[route]) {
                delete value[route];
            }
        });

        return beginData;
    }

	// событие показа панели с пользователем
	$scope.$on('showUserProfile', function(event, message) {
        // скрываем правую панель
        $rootScope.$broadcast('hideRightPanel');

        // скрываем список голсов
        //$rootScope.$broadcast('closeAllGoals');

		// позываем пользователя
		$scope.show = true;

        // если нет фиксированного определения позиции панели пользователя
        if(!message.fix) {
            // указываем переданного пользователя
            if($location.search().user1 && !$location.search().user2 && $location.search().user1 != message.user.sguid) {
                $location.search({user1: $location.search().user1, user2: message.user.sguid});

                User.compared_calculate({id: $location.search().user1});
                User.compared_calculate({id: message.user.sguid});
            }
            if(!$location.search().user1 && !$location.search().user2) {
                $location.search({user1: message.user.sguid});
            }
            if(!$location.search().user1 && $location.search().user2 && $location.search().user2 != message.user.sguid) {
                $location.search({user1: message.user.sguid, user2: $location.search().user2});

                User.compared_calculate({id: message.user.sguid});
                User.compared_calculate({id: $location.search().user2});
            }
        } else {
            // указываем переданного пользователя
            LocationService.update(message.fix, message.userId);
        }
		
        // скрываем гоалсы если они открыты
        // NeedsService.closeAllGoals($scope.workspace.needs);
    });

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function () {
    	// если нет пользователей возвращаем плашку срава
        if(!$location.search().user1 && !$location.search().user2) {
            $scope.show = false;
        }
    });
}