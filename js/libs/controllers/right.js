/**
 * Контроллер правой панели
 */
function RightController($scope) {
	// состояние блоков
	$scope.state = 0;

    // существующие состояния
    $scope.states = {
        SIGNIN: 0,
        SIGNUP: 1,
        IMPROVA: 2 
    }

    // событие убираня этого блока со страницы
    $scope.$on('hideRightPanel', function() {
    	$scope.show = false;
    });

    // показываем плашку
    $scope.$on('showRightPanel', function() {
        $scope.show = true;
    });

    // переключаем состояние панели
    $scope.changeState = function(state) {
        $scope.state = state;
    }
}