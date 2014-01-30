// контролле панели пользователей
function UsersController($scope, $location, $rootScope, $timeout) {
    // список значений нидсов для пользователя
    $scope.needsValues = {};

    // список значений голсов для пользователя
    $scope.goalsValues = {};

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
    $scope.$on('needUserValueLoaded', function (event, message) {
        $scope.needsValues = $scope.calculateValue(message.needsValues, $scope.needsValues, message.route);
    });

    // событие загрузки цифр для колбас для needs
    $scope.$on('goalUserValueLoaded', function (event, message) {
        $scope.goalsValues = $scope.calculateValue(message.goalsValues, $scope.goalsValues, message.route);
    });

    // событие загрузки цифр для колбас для needs
    $scope.$on('criteriaUserValueLoaded', function (event, message) {
        if(!$scope.criteriumsValues[message.fCriteria.sguid]) {
            $scope.criteriumsValues[message.fCriteria.sguid] = {};
        }

        var fCriteriumValue = message.fCriteria.criteria_values.filter(function(value) {
            return value.sguid == message.fCriteria.user_criteria_sguid;
        })[0];

        $scope.criteriumsValues[message.fCriteria.sguid][message.route] = fCriteriumValue.value;
    });

    // событие закрытия панели с пользователем
    $scope.$on('closeUserPanel', function (event, message) {
        $scope.needsValues = $scope.clearRoute($scope.needsValues, message.route);
        $scope.goalsValues = $scope.clearRoute($scope.goalsValues, message.route);
        $scope.criteriumsValues = $scope.clearRoute($scope.criteriumsValues, message.route);
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
		// позываем пользователя
		$scope.show = true;

		// указываем переданного пользователя
		if($location.search().user1 && !$location.search().user2 && $location.search().user1 != message.user.sguid) {
        	$location.search({user1: $location.search().user1, user2: message.user.sguid});
		}
		if(!$location.search().user1 && !$location.search().user2) {
        	$location.search({user1: message.user.sguid});
		}
		if(!$location.search().user1 && $location.search().user2 && $location.search().user2 != message.user.sguid) {
        	$location.search({user1: message.user.sguid, user2: $location.search().user2});
		}
    });

    

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function () {
    	// если нет пользователей возвращаем плашку срава
        if(!$location.search().user1 && !$location.search().user2) {
        	$rootScope.$broadcast('showRightPanel');
        }
    });
}