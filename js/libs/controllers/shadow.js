/**
 * Контроллер определяет показывать ли теневую подгрузку или нет
 * @param {[type]} $scope [description]
 */
function ShadowController($scope, $rootScope, $location) {
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

    // проверяем роутинги на которых у нас будет тенюшка
    $scope.$on('$locationChangeSuccess', function () {
        $scope.isShadow();
    });

    // затеняет страницу по указанным роутингам
    $scope.isShadow = function() {
        var shadow = false;

        // затенение для страницы сравнения
        if($location.search().user1 && $location.search().user2) {
            shadow = true;
        }

        // затеняем страницу своего профиля
        if($location.search().myprofile) {
            shadow = true;
        }

        // затенение для страницы сброса пароля
        if($location.search().change_password) {
            shadow = true;
        }

        // затенение для страницы расширенного поиска
        if($location.search().search) {
            shadow = true;
        }

        // затенение для страницы лиг
        if($location.search().leagues) {
            shadow = true;
        }

        // затенять или нет
        $scope.showShadow = shadow ? true : false;
    }

    $scope.isShadow();
}