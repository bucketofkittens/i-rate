// контроллер формы поиска слева в расширенном поиске
function SearchLeftController($scope, $location, $rootScope, User, $timeout) {
	// забираем текст поиска из location
    $scope.searchText = $location.search().text;
    $scope.resultSearch = User.search({}, { name: $scope.searchText }, $scope.advanceSearchCallback_);


	// ловим собыития с данными из расширенного поиска
	$scope.$on('updateLeftSearchList', function(event, message) {
        $scope.resultSearch = message.data;
    });

    $scope.advanceSearchCallback_ = function(data) {
        $scope.resultSearch = data;
    }

    // ищем в списке пользователей
    $scope.onSearch = function() {
       $rootScope.$broadcast('advanceSearch_', {searchText: $scope.searchText});
    }
}