/**
 * Контроллер правой панели
 */
function RightController($scope, $location) {
    // показываем блок или нет
    $scope.showPanel = $scope.phone ? false : true;

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

    $scope.closeRight = function(state) {
        $scope.showPanel = false;
    }

    $scope.$on('$locationChangeSuccess', function () {
        if($location.search().search || $location.search().user1 || $location.search().user2 || $location.search().leagues) {
            $scope.showPanel = false; 
        } else {
            $scope.showPanel = true; 
        }

        if($scope.phone) {
            $scope.showPanel = false;
        }
    });
}