/**
 * форма модального окна авторизации
 */
function SigninController($scope, SessionsService, UserService, FacebookService, SocialService, UserService) {
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

    // забираем данные о себе из i-rate
    $scope.socialLoginSuccess_ = function(data) {
        UserService.getById(data.guid, $scope.onSigninSuccessCallback_);
    }

    // авторизиуемся в facebook
    $scope.facebookLoginSuccess_ = function(data) {
        FacebookService.getUserData($scope.facebookGetUserDataSuccess_);
    }

    // забираем данные о себе из фейсубка
    $scope.facebookGetUserDataSuccess_ = function(data) {
        SocialService.login(data.email, $scope.socialLoginSuccess_);
    }

    // инициализация сервисов facebook
    FacebookService.init($scope.facebookLoginSuccess_);

    // авторизация в facebook
    $scope.socialFacebookLogin = function() {
        FacebookService.login($scope.facebookLoginSuccess_);
    }

    
}