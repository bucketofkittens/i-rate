/**
 * Контроллер страницы модальных окошек
 * @param {[type]} $scope [description]
 */
function ModalController($scope, $rootScope, LocationService, $location, $timeout) {
	$scope.template = null;
	
	$scope.$on('openModal', function(event, message) {
        LocationService.update("modal", message.name);
    });

    $scope.$on('closeModal', function(event, message) {
        LocationService.remove("modal");
    });

    $scope.closeModal = function() {
        LocationService.remove("modal");
    }

    $scope.testModal = function() {
        if($location.search().modal) {
            $scope.template = $location.search().modal;
            $scope.show = true;
        } else {
            $scope.template = null;
            $scope.show = false;
        }
    }

    $scope.$on('$locationChangeSuccess', function () {
        $scope.testModal();
    });

    $scope.testModal();
}