function ApproveCommentConroller($scope, Comments, $location, PublishReports) {
	$scope.reportSguid = null;
	$scope.commentsList = [];

	$scope.updateSguid = function() {
		if($location.search().report) {
	        $scope.reportSguid = $location.search().report;
	    }	
	}

	$scope.getMessages = function() {
        PublishReports.get_by_user({user_guid: $location.search().approve_profile}, {}, function(data) {
            angular.forEach(data, function(value, key){
                value.post_date = moment(value.post_date).format("MMM DD, YYYY h:mm a");
            });
            
            $scope.commentsList = data;
        });
    }

	$scope.updateSguid();
	$scope.getMessages();
}