
function MenuController($scope, $location) {
    $scope.items = [
    	{ title: "Approve", href: "/admin/index.html#/approve", path: "approve" },
    	{ title: "Reports", href: "/admin/index.html#/reports", path: "reports" },
    	{ title: "Graph", href: "/admin/index.html#/graphs", path: "graphs" },
    	{ title: "NSI", href: "/admin/index.html#/nsi", path: "nsi" }
    ];

    $scope.selectCurrentItem = function(path) {
    	console.log(path);
    	angular.forEach($scope.items, function(value, key) {
    		if(value.path == path) {
    			value.current = true;
    		} else {
    			value.current = false;
    		}
    	});
    }

    $scope.selectCurrentItem($location.path().replace("/", ""));

    $scope.onItemClick = function(item) {
    	$scope.selectCurrentItem(item.path);
    	$location.path(item.href);
    }
}