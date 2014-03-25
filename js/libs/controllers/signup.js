/**
 * Форма создания нового пользователя
 */
function SignupController($scope, UserService, Recaptha, $rootScope, SessionsService, $timeout) {
    // модель формы
    $scope.user = {
        email: "",
        password: ""
    }

    $scope.openTerms = function() {
        $rootScope.$broadcast('openModal', {name: "terms"});
    }

    $scope.openPolicy = function() {
        $rootScope.$broadcast('openModal', {name: "policy"});
    }

    /**
     *  добавлям нового пользователя
     */
    $scope.addUser = function ($event) {
        // проверяем капчу
        Recaptha.verify(
            {}, 
            {
                challenge: Recaptcha.get_challenge(),
                response: Recaptcha.get_response()
            }, 
            function(data) {
                if(data.success) {
                    $scope.clearErrors();

                    // если капча верна создаем нового пользователя
                    UserService.create({
                        "name": $scope.user.email.split("@")[0],
                        "login": $scope.user.email,
                        "email": $scope.user.email,
                        "password": $scope.user.password
                    }, $scope.onAddUserSuccessCallback_, $scope.onAddUserFailCallback_);
                } else {
                    $scope.clearErrors();

                    $scope.errorValidate = "Text invalid";
                }
            }
        );
        
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        UserService.isAdmin(data.sguid, $scope.isAdminCallback_);

        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);

        $scope.workspace.user = data;

        $timeout(function() {
            $rootScope.$broadcast('openProfile', { nav: "Settings" });
        }, 0);
    }

    // событие если пользователь создался
    $scope.onAddUserSuccessCallback_ = function(data) {
        SessionsService.signin({
                "email": $scope.user.email,
                "password": $scope.user.password
            },
            $scope.onSigninSuccessCallback_,
            $scope.onSigninFailCallback_
        );
    }

    $scope.onSigninFailCallback_ = function(data) {
        $scope.error = data.message;
    }

    // приводим текст ошибок в порядок
    $scope.onAddUserFailCallback_ = function(data) {
        $scope.clearErrors();

        angular.forEach(data.errors, function(value, key) {
            if(value && value == 'login: ["is already taken"]') {
                $scope.errorEmail = "Exists specified email.";
            }
            if(value && value == 'name: ["is already taken"]') {
                $scope.errorEmail = "Exists specified name.";
            }
        });
    }

    $scope.clearErrors = function() {
        Recaptcha.reload();

        $scope.errorValidate = null;
        $scope.errors = "";
        $scope.errorEmail = "";
        $scope.errorName = "";
    }
}