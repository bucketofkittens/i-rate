/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 */
function RightController($scope) {
    
    $scope.signup = false;

    $scope.signupChange = function(state) {
        $scope.signup = state;
    }
}