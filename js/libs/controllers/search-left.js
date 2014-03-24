// контроллер формы поиска слева в расширенном поиске
function SearchLeftController($scope, $location, $rootScope, User, $timeout, UserService) {
	// забираем текст поиска из location
    $scope.searchText = $location.search().text;
    $scope.resultSearch = User.search_skip_limit({}, { name: $scope.searchText, skip: $scope.skip, limit: $scope.limit }, $scope.advanceSearchCallback_);


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
        angular.forEach(data, function(value, key) {
            if(!data[key].top_points) {
                UserService.getGoalsPointsById(value.sguid, function(dataItem) {
                    if(dataItem[$scope.search.top.sguid]) {
                        data[key].top_points = dataItem[$scope.search.top.sguid];
                    }
                });    
            }
        });
    }

    $scope.advanceSearchCallback_ = function(data) {
        $scope.loaderShow = false;
        $scope.resultSearch = data;
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
}