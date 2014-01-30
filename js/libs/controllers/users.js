// контролле панели пользователей
function UsersController($scope, $location, $rootScope, $timeout) {
	// список пользователей
	$scope.users = {};

	// определяем показываем ли мы панель или нет
	$scope.show = $location.search().user1 || $location.search().user2 ? true : false;

	// закрываем правую панель. Грязный хак. нужно будет переписать когда пойму как.
	if($scope.show) {
		$timeout(function(){
			$rootScope.$broadcast('hideRightPanel');
		}, 0);
	}

	// событие срабаывает когда забираются данные с плашки пользователя
    $scope.$on('userGetById', function (event, message) {
    	$scope.users[message.route] = message.user;
    });

    // событие загрузки цифр для колбас для needs
    $scope.$on('needUserValueLoaded', function (event, message) {
    	$scope.getUserById(message.userId).needs_values = message.needsValues;
    });

    // ищет вхождение в массив пользователей по id
    $scope.getUserById = function(id) {
    	return angular.forEach($scope.users, function(value, key){
    		if(value.sguid == id) {
    			return value;
    		}
    	});
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