// контроллер формы поиска слева в расширенном поиске
function SearchLeftController($scope, $location, $rootScope) {
	// забираем текст поиска из location
    $scope.searchText = $location.search().text;

    // проверяем загрузку всех по
    $rootScope.$watch('users', function() {
		$scope.test_($scope.searchText);
	});

	// ловим собыития с данными из расширенного поиска
	$scope.$on('updateLeftSearchList', function(event, message) {
        $scope.resultSearch = message.data;
    });

    // ищем в списке пользователей
    $scope.onSearch = function() {
        // очищаем результат поиска
        $scope.resultSearch = [];
        // проверяем сколько символов в строке поиска
        if($scope.searchText.length > 0) {
            // проверяем вхождение
            $scope.resultSearch = $scope.test_($scope.searchText);
        }
    }
}