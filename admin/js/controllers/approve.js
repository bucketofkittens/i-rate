function ApproveController($scope, $location, User, PublishReports) {
	$scope.approves = [];

	$scope.getListCallback_ = function(data) {
        angular.forEach(data, function(value, key) {
            PublishReports.get_by_user({user_guid: value.sguid}, {}, function(data) {
                value.lastComment = data[0];
            });
        });
		$scope.approves = data;
	}

    $scope.getList = function() {
    	User.not_allowed_for_publish({}, {}, $scope.getListCallback_);
    }

    $scope.openAprove = function(value) {
        $location.search({"approve_profile": value.sguid});
    }

    $scope.$on('updateApprove', function () {
        $scope.getList();
    });

    $scope.getList();
}