function ChangeEmailController($scope, User, $location, Sessions) {
    $scope.form = {
        password: "",
        newEmail: ""
    }

    $scope.onCancel = function() {
        $location.path("/my_profile");
    }

    $scope.onChangeEmail = function() {
        Sessions.signin({}, $.param({
            "login": $scope.workspace.user.login,
            "password": $scope.form.password
        }), function(data) {
            if(data.success) {
                var user = {
                    "email": $scope.form.newEmail
                }

                User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                        $scope.workspace.user.email = $scope.form.newEmail;
                        $location.path("/my_profile/");
                    }
                );
            } else {
                $scope.error = data.message;
            }
        });
    }
}