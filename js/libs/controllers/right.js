/**
 * Контроллер правой панели
 */
function RightController($scope) {
    
    // определяет в каком состоянии находится signup или нет
    $scope.signup = false;

    // переключаем состояние панели
    $scope.signupChange = function(state) {
        $scope.signup = state;
    }
}