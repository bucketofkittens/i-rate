function MyProfileSettingsController($scope, UserService, SocialService, FriendsService) {
	$scope.onLogout = function() {
		UserService.clearAuthData();
		SocialService.clear();

		$scope.workspace.user = null;
		$scope.workspace.friends = FriendsService.getList();
	}
}