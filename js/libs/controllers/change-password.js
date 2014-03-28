function ChangePasswordController($scope, Sessions, User, $location, $rootScope, MailHash, $routeParams, Password, $window, $cookieStore, $window, LocationService) {
    $scope.show = false;
    $scope.dismath = false;

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

    $scope.testState = function() {
        if($location.search().hash) {
            $scope.state = 2;
            $scope.hash = $location.search().mail_hash;

            if($location.search().hash && $location.search().hash != "true") {
                $scope.form.code = $location.search().hash;
            }
        } else {
            $scope.state = 1;
        }
    }

    $scope.onChangePasswordCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordCancel2 = function() {
        LocationService.remove("mail_hash");
    }

    $scope.message = 0;

    $scope.state = 1;

    $scope.userSguid = "";

    $scope.hash = "";

    $scope.isEmailNotFound = false;

    $scope.$on('$locationChangeSuccess', function () {
        $scope.testState();
    });

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

                    LocationService.update("hash", "true");
                });
            } else {
                $scope.isEmailNotFound = true;
            }
        });
    }

    $scope.onChangePasswordBegin = function() {
        var user = {
            "password": $scope.form.newPassword,
            "reset_hash": $scope.form.code
        }

        $scope.dismath = false;

        Password.update({},  user, function(data) {
            if(data.success) {
                $scope.message = 3;
            } else {
                $scope.dismath = true;
            }
        });
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

    $scope.testState();
}