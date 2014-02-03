/**
 * форма модального окна авторизации
 */
function SigninController($scope, SessionsService, UserService, FacebookService, SocialService, UserService, MSLiveService, GooglePlusService) {
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
        SessionsService.signin({
                "email": $scope.login.email, 
                "password": $scope.login.password
            },
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

    // авторизация в facebook
    $scope.socialFacebookLogin = function() {
        FacebookService.login($scope.facebookLoginSuccess_);
    }

    $scope.MSLiveLoginSuccess_ = function(session) {
        MSLiveService.getUserData($scope.MSLiveLoginGetUserDataSuccess_);
    }

    $scope.MSLiveLoginFail_ = function(data) {
    }

    $scope.MSLiveLoginGetUserDataSuccess_ = function(data) {
        SocialService.login(data.emails.account, $scope.socialLoginSuccess_);
    }

    $scope.MSLiveLoginCompleteSuccess_ = function() {
        MSLiveService.getUserData($scope.MSLiveLoginGetUserDataSuccess_);
    }

    $scope.socialMicrosoftLiveLogin = function() {
        MSLiveService.login($scope.MSLiveLoginSuccess_, $scope.MSLiveLoginFail_);
    };

    $scope.googlePlusLoginFail_ = function() {

    }

    $scope.gogglePlustLoginSuccess_ = function(data) {
        SocialService.login(data.email, $scope.socialLoginSuccess_);
    }

    $scope.socialGooglePlusLogin = function() {
        GooglePlusService.login($scope.gogglePlustLoginSuccess_, $scope.googlePlusLoginFail_);
    }

    // инициализация сервисов facebook
    FacebookService.init($scope.facebookLoginSuccess_);

    MSLiveService.init($scope.MSLiveLoginCompleteSuccess_);
}