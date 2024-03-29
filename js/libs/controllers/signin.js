/**
 * форма модального окна авторизации
 */
function SigninController($scope, $rootScope, $timeout, SessionsService, FacebookService, SocialService, UserService, MSLiveService, GooglePlusService, User, $location, TokenService) {
    // сообщение об ошибке
    $scope.error = null;

    // модель формы авторизации
    $scope.login = {
        login: "",
        password: ""
    }

    // нажатие enter в форме
    $scope.onKeyPress = function(state) {
        if(!state) {
            $scope.onSingin();
        }
    }

    // переход на страницу смены пароля
    $scope.onChangePassword = function() {
        $rootScope.$broadcast('openModal', {name: "reset_password"});
        //$location.search({ change_password: true });
    }

    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }

    $scope.onSigninFailCallback_ = function(data) {
        $scope.error = data.message;
    }

    $scope.isAdminCallback_ = function(data, sguid) {
        $scope.workspace.isAdmin = data;

        if($scope.workspace.isAdmin) {
            var admin_token = TokenService.get();

            lscache.set("admin_user", '"'+sguid+'"', 1440);
            lscache.set("admin_token", admin_token, 1440);
        }
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        UserService.isAdmin(data.sguid, $scope.isAdminCallback_);

        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);

        $scope.workspace.user = data;

        // если у пользователя нет баллов переходим сразу на колбасы
        if(data.points == 0 || !data.points) {
            $timeout(function() {
                $rootScope.$broadcast('openProfile', { nav: "Settings" });
            }, 0);
        }
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
    $scope.socialLoginSuccess_ = function(data, socialName) {
        // сохраняем имя социалки через какую вошли
        SocialService.persist(socialName);

        // забираем данные пользователя
        UserService.getById(data.guid, $scope.onSigninSuccessCallback_);
    }

    // авторизиуемся в facebook
    $scope.facebookLoginSuccess_ = function(data) {
        console.log(data);
        if(data.status == "connected") {
            FacebookService.getUserData($scope.facebookGetUserDataSuccess_);    
        }
        
    }

    // забираем данные о себе из фейсубка
    $scope.facebookGetUserDataSuccess_ = function(data) {
        SocialService.login(data.email, $scope.socialLoginSuccess_, SocialNames.FACEBOOK, data);
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
        SocialService.login(data.emails.account, $scope.socialLoginSuccess_, SocialNames.MSLIVE, data);
    }

    $scope.MSLiveLoginCompleteSuccess_ = function() {
        MSLiveService.getUserData($scope.MSLiveLoginGetUserDataSuccess_);
    }

    $scope.socialMicrosoftLiveLogin = function() {
        MSLiveService.login($scope.MSLiveLoginSuccess_, $scope.MSLiveLoginFail_);
    };

    $scope.googlePlusLoginFail_ = function() {

    }

    $scope.googleUserDataCallback_ = function(data) {
        SocialService.login(data.email, $scope.socialLoginSuccess_, SocialNames.GOOGLE_PLUS, data);
    }

    $scope.gogglePlustLoginSuccess_ = function(data) {
        GooglePlusService.getUserData($scope.googleUserDataCallback_);
    }

    $scope.socialGooglePlusLogin = function() {
        GooglePlusService.login($scope.gogglePlustLoginSuccess_, $scope.googlePlusLoginFail_);
    }

    // инициализация сервисов facebook
    FacebookService.init();

    MSLiveService.init($scope.MSLiveLoginCompleteSuccess_);
}