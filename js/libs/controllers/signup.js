/**
 * Форма создания нового пользователя
 */
function SignupController($scope, UserService, Recaptha) {
    // модель формы
    $scope.user = {
        email: "",
        password: ""
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
                Recaptcha.reload();
                if(data.success) {
                    $scope.errorValidate = null;

                    // если капча верна создаем нового пользователя
                    UserService.create({
                        "name": $scope.user.email.split("@")[0],
                        "login": $scope.user.email,
                        "email": $scope.user.email,
                        "password": $scope.user.password
                    }, null, $scope.onAddUserSuccessCallback_);
                } else {
                    $scope.errorValidate = "Text invalid";
                }
            }
        );
        
    }

    // приводим текст ошибок в порядок
    $scope.onAddUserSuccessCallback_ = function(data) {
        $scope.errors = "";
        $scope.errorEmail = "";
        angular.forEach(data.errors, function(value, key) {
            if(value && value == 'login: ["is already taken"]') {
                $scope.errorEmail = "Exists specified email.";
            }
        });
    }
}