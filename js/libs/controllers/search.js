/**
 * Конроллер поиска
 */
function SearchController($scope, User, $rootScope, $location) {
    /**
     * Текст который ищется
     * @type {String}
     */
    $scope.searchText = "";

    /**
     * Отфильтрованный результат поиска
     * @type {Array}
     */
    $scope.resultSearch = [];

    /**
     * Переход на страницу профиля пользователя
     * @todo переменовать в toLocationProfile например
     * @param  {[type]} userItem [description]
     * @return {[type]}          [description]
     */
    $scope.userClick = function(userItem) {
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }

    /**
     * Переход на страницу расширенного поиска
     * @return {[type]} [description]
     */
    $scope.onAdvanceSearch = function() {
        $location.path("/search").search({text: $scope.searchText});

        $scope.resultSearch = [];
        $scope.searchText = "";
    }

    // calback для скрытия поиска
    this.windowClickCallback_ = function(event) {
        if(event.target.tagName != "IMG") {
            $scope.$apply(function() {
                $scope.resultSearch = [];
                $scope.searchText = "";
                $rootScope.$broadcast('showRightPanel');
            });
        }
    }

    /**
     * Скрывать поиск при клике вне него
     */
    window.onclick = this.windowClickCallback_;


    // проверяем вхождения пользователей
    $scope.test_ = function() {
        angular.forEach($rootScope.users, function(value, key) {
            var reg = new RegExp($scope.searchText.replace("[", "\\[").replace("]", "\\]"), "i");
            if(value.name && value.name != null && value.name != "null" && reg.test(value.name)) {
                if(!value.league) {
                    value.league = {name: "10"};
                }
                var isset = false;
                angular.forEach($scope.resultSearch, function(resValue, resKey){
                    if(resValue.sguid == value.sguid) {
                        isset = true;
                    }
                });
                if(!isset) {
                    $scope.resultSearch.push(value);   
                }
            }
        });
    }

    // ищем в списке пользователей
    $scope.onSearch = function() {
        // очищаем результат поиска
        $scope.resultSearch = [];

        // проверяем сколько символов в строке поиска
        if($scope.searchText.length > 0) {
            // проверяем вхождение
            $scope.test_();

            // скрываем правую панель
            $rootScope.$broadcast('hideRightPanel');
        } else {
            // показываем правую панель
            $rootScope.$broadcast('showRightPanel');
        }
    }

    $scope.$on('hideSearch', function($event) {
       $scope.resultSearch = [];
       $scope.searchText = "";
    });

    $scope.$on('updateSearchList', function($event, message) {
        if($scope.id == message.id) {
            $scope.resultSearch = message.data;    
        }
    });
}