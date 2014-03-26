function ReportCommentConroller($scope, Comments, $location) {
	$scope.reportSguid = null;
	$scope.commentsList = [];

	$scope.updateSguid = function() {
		if($location.search().report) {
	        $scope.reportSguid = $location.search().report;
	    }	
	}

	$scope.getMessages = function() {
        Comments.get_by_user({owner_guid: $scope.reportSguid, owner_type: 4}, {}, function(data) {
            angular.forEach(data, function(value, key){
                value.post_date = moment(value.post_date).format("MMM DD, YYYY h:mm a");
            });
            
            $scope.commentsList = data;
        });
    }

	$scope.updateSguid();
	$scope.getMessages();
}