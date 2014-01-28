/**
 * форма модального окна авторизации
 */
function SigninController($scope, SessionsService, UserService) {
    // сообщение об ошибке
    $scope.error = null;

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

    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }

    $scope.onSigninFailCallback_ = function(data) {
        $scope.error = data.message;
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);

        $scope.workspace.user = data;
    }

    /**
    * получение данных пользователя
    */
    $scope.onSingin = function(data) {
        SessionsService.signin(
            $scope.login.email, 
            $scope.login.password, 
            $scope.onSigninSuccessCallback_,
            $scope.onSigninFailCallback_
        );
    }
}