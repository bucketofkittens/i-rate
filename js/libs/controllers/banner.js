function BannerController($scope) {
	$scope.show = false;

	$scope.cacheName = "banner";

	$scope.cacheTime = 111440;

	if(!lscache.get($scope.cacheName)) {
		$scope.show = true;
	}

	$scope.close = function() {
		lscache.set($scope.cacheName, "1", $scope.cacheTime);
		$scope.show = false;
	}
}