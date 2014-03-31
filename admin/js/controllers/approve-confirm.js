function ApproveConfirmConroller($scope, ReportService, $location, $rootScope, Comments, User) {
	$scope.form = {
		message: ""
	}

    $scope.$on('$locationChangeSuccess', function () {
        
    });

    $scope.createComment = function() {
    	if($scope.form.message.length > 0) {
            Comments.create({}, {
                owner_type: 4,
                author_guid: $scope.workspace.user.sguid,
                post_date: moment().format("DD-MM-YYYY HH:mm:ss"),
                message: $scope.form.message,
                owner_guid: $scope.reportSguid
            }, function(data) {
                
            });
        }
    }

    $scope.denyCallback_ = function(data) {
    	$rootScope.$broadcast('updateReport');
    	$scope.createComment();
    	$scope.close();
    }

    $scope.allowCallback_ = function(data) {
    	$rootScope.$broadcast('updateReport');
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