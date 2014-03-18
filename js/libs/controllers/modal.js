/**
 * Контроллер страницы модальных окошек
 * @param {[type]} $scope [description]
 */
function ModalController($scope, $rootScope, LocationService, $location) {
	$scope.template = null;
	
	$scope.$on('openModal', function(event, message) {
        LocationService.update("modal", message.name);
    });

    $scope.$on('closeModal', function(event, message) {
        console.log("closeModal");
        LocationService.remove("modal");
    });

    $scope.closeModal = function() {
        console.log("closeModal");
        LocationService.remove("modal");
    }

    $scope.testModal = function() {
        if($location.search().modal) {
            $rootScope.$broadcast('showShadow');
            $scope.template = $location.search().modal;
            $scope.show = true;
        } else {
            $scope.template = null;
            $scope.show = false;

            $rootScope.$broadcast('hideShadow');
        }
    }

    $scope.$on('$locationChangeSuccess', function () {
        $scope.testModal();
    });

    $scope.testModal();
}