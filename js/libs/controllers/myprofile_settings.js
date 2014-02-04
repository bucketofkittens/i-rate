function MyProfileSettingsController($scope, UserService, SocialService, FriendsService, TokenService) {
	$scope.onLogout = function() {
		TokenService.remove();
		UserService.clearAuthData();
		SocialService.clear();

		$scope.workspace.user = null;
		$scope.workspace.friends = FriendsService.getList();
	}
}