// контроллер авторизации через импрувы
function ImprovaLoginController($scope, ImprovaService, SessionsService, UserService, $timeout, $rootScope, SocialService) {
	$scope.improvaForm = {
		email: "",
		password: ""
	}

	$scope.onUserUpdateSuccess_ = function(data) {
		
	}

	$scope.onUserCreateFail_ = function(data) {

	}

    $scope.onSigninSuccessCallback_ = function(data) { 
        SocialService.persist(SocialNames.IMPROVA);

        UserService.setAuthData(data);
        UserService.getFriends(data.sguid, $scope.getFriendsCallback_);

        $scope.workspace.user = data;

        // если у пользователя нет баллов переходим сразу на колбасы
        if(data.points == 0) {
            $timeout(function() {
                $rootScope.$broadcast('openProfile', { nav: "Profile" });
            }, 0);
        }
    }

	$scope.improvaLoginSuccess_ = function(data) {
       ImprovaService.improvaToIRateMigrate($scope.improvaForm, data, $scope.onSigninSuccessCallback_, $scope.onUserCreateFail_);
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