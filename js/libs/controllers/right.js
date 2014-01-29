/**
 * Контроллер правой панели
 */
function RightController($scope) {
	// определяет показывается ли блок или нет
	$scope.show = true;
    
    // определяет в каком состоянии находится signup или нет
    $scope.signup = false;

    // событие убираня этого блока со страницы
    $scope.$on('hideRightPanel', function() {
    	$scope.show = false;
    });

    // переключаем состояние панели
    $scope.signupChange = function(state) {
        $scope.signup = state;
    }
}