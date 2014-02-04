/**
 * Контроллер определяет показывать ли теневую подгрузку или нет
 * @param {[type]} $scope [description]
 */
function ShadowController($scope, $rootScope) {
    $scope.showShadow = false;

    /**
     * При клике на тенюшку, убрием modal окно
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onHideModal = function() {
        $rootScope.$broadcast('hideModal');
    }

    /**
     * Показывать
     * @return {undefined} 
     */
    $scope.$on('showShadow', function() {
        $scope.showShadow = true;
    });

    /**
     * Не показывать
     * @return {undefined} 
     */
    $scope.$on('hideShadow', function() {
        $scope.showShadow = false;
    });
}