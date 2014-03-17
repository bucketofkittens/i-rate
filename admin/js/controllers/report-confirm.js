function ReportConfirmConroller($scope, ReportService, $location) {
	$scope.reportSguid = null;

	$scope.updateSguid = function() {
		if($location.search().report) {
	        $scope.reportSguid = $location.search().report;
	    }	
	}

	$scope.updateSguid();

    $scope.$on('$locationChangeSuccess', function () {
        $scope.updateSguid();
    });

    $scope.denyCallback_ = function(data) {
    	$scope.close();
    }

    $scope.allowCallback_ = function(data) {
    	$scope.close();
    }

	$scope.onConfirm = function() {
		ReportService.allow($scope.reportSguid, $scope.allowCallback_);
	}

	$scope.onReject = function() {
		ReportService.deny($scope.reportSguid, $scope.denyCallback_);
	}
}