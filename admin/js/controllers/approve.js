function ApproveController($scope, $location, User) {
	$scope.approves = [];

	$scope.getListCallback_ = function(data) {
		$scope.approves = data;
	}

    $scope.getList = function() {
    	User.not_allowed_for_publish({}, {}, $scope.getListCallback_);
    }

    $scope.openAprove = function(value) {
        $location.search({"approve_profile": value.sguid});
    }

    $scope.getList();
}