// контроллер формы поиска слева в расширенном поиске
function SearchLeftController($scope, $location, $rootScope, User, $timeout, UserService) {
	// забираем текст поиска из location
    $scope.searchText = $location.search().text;

    


	// ловим собыития с данными из расширенного поиска
	$scope.$on('updateLeftSearchList', function(event, message) {
        $scope.resultSearch = message.data;
        $scope.appendTopData($scope.resultSearch);
    });

    $scope.$on('updateLeftSearchPushList', function(event, message) {
        $scope.resultSearch = $scope.resultSearch.concat(message.data);
        $scope.appendTopData($scope.resultSearch);
    });

    $scope.appendTopData = function(data) {
        if($scope.topFilter) {
            angular.forEach(data, function(value, key) {
                if(!data[key].top_points) {
                    UserService.goals_point_by_sguid(value.sguid, $scope.search.top.sguid, function(dataItem) {
                        data[key].top_points = dataItem.points;
                    });    
                }
            });    
        }
    }

    $scope.textCurrentUser_ = function() {
        if($location.search().search_profile) {
            angular.forEach($scope.resultSearch, function(value, key) {
                if(value.sguid == $location.search().search_profile) {
                    value.current = true;
                }
            });
        }
    }

    $scope.advanceSearchCallback_ = function(data) {
        $scope.loaderShow = false;
        $scope.resultSearch = data;

        $scope.textCurrentUser_();
    }

    // ищем в списке пользователей
    $scope.onSearch = function() {
        if($scope.changeTimer !== false) clearTimeout($scope.changeTimer);

        var text = $scope.searchText;

        $scope.changeTimer = setTimeout(function() {
            $scope.$apply(function() {
                $rootScope.$broadcast('advanceSearch_', {searchText: text});
                $scope.changeTimer = false;
            });
        }, 700);
    }

    $scope.closeAllUser_ = function(users) {
        angular.forEach($scope.resultSearch, function(item, key) {
            item.current = false;
        });
    }

    $scope.$on('closeUserPanel', function () {
        $scope.closeAllUser_();
    });

    User.search_skip_limit({}, { name: $scope.searchText, skip: $scope.skip, limit: $scope.limit }, $scope.advanceSearchCallback_);
}