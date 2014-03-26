function ReportConfirmConroller($scope, ReportService, $location, $rootScope, Comments) {
	$scope.reportSguid = null;
	$scope.form = {
		message: ""
	}

	$scope.updateSguid = function() {
		if($location.search().report) {
	        $scope.reportSguid = $location.search().report;
	    }	
	}

	$scope.updateSguid();

    $scope.$on('$locationChangeSuccess', function () {
        $scope.updateSguid();
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
		ReportService.allow($scope.reportSguid, $scope.allowCallback_);
	}

	$scope.onReject = function() {
		ReportService.deny($scope.reportSguid, $scope.denyCallback_);
	}
}