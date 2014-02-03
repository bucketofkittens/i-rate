// контроллер авторизации через импрувы
function ImprovaLoginController($scope, ImprovaService, SessionsService, UserService) {
	$scope.improvaForm = {
		email: "",
		password: ""
	}

	$scope.onUserUpdateSuccess_ = function(data) {
		
	}

	$scope.onUserCreateSuccess_ = function(data) {
		var user = {}

        if(dataImprova.name) {
            user["name"] = dataImprova.name;
        }
        if(dataImprova.birthday) {
            user["birthday"] = dataImprova.birthday;
        }

        UserService.update(data.sguid, user, $scope.onUserUpdateSuccess_);
	}

	$scope.onUserCreateFail_ = function(data) {

	}

	$scope.onSigninFailCallback_ = function(data) {
		UserService.create({
            "login": $scope.improvaForm.email,
            "email": $scope.improvaForm.email,
            "name": $scope.improvaForm.email,
            "password": "",
            "confirmed": "1"
        }, $scope.onUserCreateSuccess_, $scope.onUserCreateFail_);
    }

    $scope.onSigninSuccessCallback_ = function(data) {
        UserService.setAuthData(data);
        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);

        $scope.workspace.user = data;
    }

	$scope.improvaLoginSuccess_ = function(data) {
		SessionsService.signin({
                "email": $scope.improvaForm.email, 
                "password": "",
                "from_improva": "1"
            },
            $scope.onSigninSuccessCallback_,
            $scope.onSigninFailCallback_
        );
	}

	$scope.improvaLoginFail_ = function(data) {
		$scope.improvaError = "No user";
	}

	$scope.improvaLogin = function() {
		ImprovaService.login(
            $scope.improvaForm.email, 
            $scope.improvaForm.password,
            $scope.improvaLoginSuccess_,
            $scope.improvaLoginFail_
        );
	}
}