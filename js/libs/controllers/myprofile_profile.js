function MyProfileProfileController($scope) {
	$scope.goalClick = function($event, needItem, goalItem, needs) {
		$scope.openCriteriumList($event, needItem, goalItem, needs);	
	}
}