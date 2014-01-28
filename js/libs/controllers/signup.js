/**
 *
 */
function SignupController($scope, UserService) {
    // модель формы
    $scope.user = {
        email: "",
        password: ""
    }

    /**
     *  добавлям нового пользователя
     */
    $scope.onAddUser = function ($event) {
        UserService.create({
            "name": $scope.user.email.split("@")[0],
            "login": $scope.user.email,
            "email": $scope.user.email,
            "password": $scope.user.password
        }, null, $scope.onAddUserSuccessCallback_);
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