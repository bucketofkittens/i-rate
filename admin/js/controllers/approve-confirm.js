function ApproveConfirmConroller($scope, ReportService, $location, $rootScope, Comments, User, PublishReports) {
	$scope.form = {
		message: ""
	}

    $scope.$on('$locationChangeSuccess', function () {
        
    });

    $scope.createComment = function() {
    	if($scope.form.message.length > 0) {
            PublishReports.add({}, {
                //  owner_type: 4,
                user_guid: $location.search().approve_profile,
                post_date: moment().format("DD-MM-YYYY HH:mm:ss"),
                message: $scope.form.message
            }, function(data) {
                
            });
        }
    }

    $scope.denyCallback_ = function(data) {
    	$rootScope.$broadcast('updateApprove');
    	$scope.createComment();
    	$scope.close();
    }

    $scope.allowCallback_ = function(data) {
    	$rootScope.$broadcast('updateApprove');
    	$scope.createComment();
    	$scope.close();
    }

	$scope.onConfirm = function() {
		User.allow_for_publish({id: $location.search().approve_profile}, $scope.allowCallback_);
	}

	$scope.onReject = function() {
        User.deny_for_publish({id: $location.search().approve_profile}, $scope.allowCallback_);
	}
}