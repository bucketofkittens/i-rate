function ChangePasswordController($scope, Sessions, User, $location, $rootScope, MailHash, $routeParams, Password, $window, $cookieStore, $window) {
    $scope.show = false;

    $scope.form = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        email: "",
        code: ""
    }

    $scope.$watch('workspace.user', function (newVal, oldVal, scope) {
        if($scope.workspace.user) {
            $scope.form.email = $scope.workspace.user.email;
        }
    });

    $scope.onChangePasswordCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordCancel2 = function() {
        $scope.state = 1;
    }

    $scope.message = 0;

    $scope.state = 1;

    $scope.userSguid = "";

    $scope.hash = "";

    $scope.isEmailNotFound = false;

    if($routeParams.hash) {
        $scope.hash = $routeParams.hash;
        $scope.state = 2;
    }

    $scope.onBack = function() {
        $window.history.back();
    }

    $scope.onChangePasswordChanged = function() {
        $scope.state = 1;
        $scope.message = 0;

        $scope.form = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            code: ""
        }

        if($scope.workspace.user) {
            $scope.form.email = $scope.workspace.user.email;
        }
        
        $scope.onBack();
    }

    $scope.onCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordOk = function() {
        $scope.message = 0;
        $scope.state = 2;
    }

    $scope.onChangePassword = function() {
        User.test_email({}, {email: $scope.form.email}, function(data) {
            if(data.success) {
                $scope.isEmailNotFound = false;
                MailHash.create({}, {
                    "email": $scope.form.email
                }, function(data) {
                    $scope.userSguid = data.guid;
                    $scope.message = 1;
                });
            } else {
                $scope.isEmailNotFound = true;
            }
        });
    }

    $scope.onChangePasswordBegin = function() {
        var user = {
            "password": $scope.form.newPassword,
            "email": $scope.form.email,
            "code": $scope.form.code
        }

        Password.update({},  user, function(data) {
                $scope.message = 3;
            }
        );
    }

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function () {
        $scope.show = $location.search().change_password ? true : false;

        if($scope.show) {
            $scope.state = 1;
        }
    });

    $scope.show = $location.search().change_password ? true : false;

    if($scope.show) {
        $scope.state = 1;
    }
}