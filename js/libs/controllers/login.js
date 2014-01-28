/**
 * форма модального окна авторизации
 */
function LoginController($scope) {

    // модель формы авторизации
    $scope.login = {
        login: "",
        password: ""
    }

    // нажатие enter в форме
    $scope.onKeyPress = function($event) {
        if(!$scope.LoginForm.$invalid) {
            $scope.onSingin();
        }
    }

    /**
     * получение данных пользователя
     */
    $scope.onSingin = function(data) {
        Sessions.signin({}, $.param({
            "email": $scope.login.email,
            "password": $scope.login.password
        }), function(data) {
            if(data.success) {
                $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: false, token: data.token});
                $scope.show = false;
            } else {
                $scope.error = data.message;
            }
        });
    }
}