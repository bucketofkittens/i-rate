/**
 * Контроллер правой панели
 */
function RightController($scope) {
    // показываем блок или нет
    $scope.showPanel = true;

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
    	$scope.showPanel = false;
    });

    // показываем плашку
    $scope.$on('showRightPanel', function() {
        $scope.showPanel = true;
    });

    // переключаем состояние панели
    $scope.changeState = function(state) {
        $scope.state = state;
    }
}