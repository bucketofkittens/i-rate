/**
 * Контроллер панели друзей  
 */
function FollowController($scope, $rootScope) {

    // открываем планшку с пользователем
    $scope.openUser = function(userItem) {
        $rootScope.$broadcast('hideRightPanel');
        $rootScope.$broadcast('closeAllGoals');
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }
}