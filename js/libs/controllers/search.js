/**
 * Конроллер поиска
 */
function SearchController($scope, User, $rootScope, $location, $timeout) {
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

    // таймер отправки запроса на сервер
    $scope.changeTimer = false;

    /**
     * Переход на страницу профиля пользователя
     * @todo переменовать в toLocationProfile например
     * @param  {[type]} userItem [description]
     * @return {[type]}          [description]
     */
    $scope.userClick = function(userItem) {
        $scope.resultSearch = [];
        $scope.searchText = "";
        
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }

    /**
     * Переход на страницу расширенного поиска
     * @return {[type]} [description]
     */
    $scope.onAdvanceSearch = function() {
        $location.search({search: true, text: $scope.searchText});

        $scope.resultSearch = [];
        $scope.searchText = "";

        $rootScope.$broadcast('hideRightPanel');
    }

    $scope.close = function() {
        $scope.resultSearch = [];
        $scope.searchText = "";
    }

    $scope.$on('closeSearch', function(event) {
        $scope.close();
    });

    // calback для скрытия поиска
    this.windowClickCallback_ = function(event) {
        // id блока поиска
        var searchId = "#search";

        // список тегов
        var tags = {
            IMG: "IMG",
            INPUT: "INPUT"
        }

        if(event.target.tagName != tags.IMG && event.target.tagName != tags.INPUT) {
            $scope.$apply(function() {
                $scope.resultSearch = [];
                $scope.searchText = "";
                if($(event.target).parents(searchId).length == 0 && !$location.search().user1 && !$location.search().user2 && !$location.search().leagues && !$location.search().search) {
                    $rootScope.$broadcast('showRightPanel');    
                }
            });
        }
    }

    /**
     * Скрывать поиск при клике вне него
     */
    if(document.getElementsByTagName("header")[0]) {
        document.getElementsByTagName("header")[0].onclick = this.windowClickCallback_;
    }

    $scope.advanceSearchCallback_ = function(data) {
        $scope.resultSearch = data;

        $rootScope.$broadcast('hideRightPanel');
    }

    // ищем в списке пользователей
    $scope.onSearch = function() {
        // очищаем результат поиска
        $scope.resultSearch = [];
        // проверяем сколько символов в строке поиска
        if($scope.searchText.length > 0) {
            // проверяем вхождение
            if($scope.changeTimer !== false) clearTimeout($scope.changeTimer);

            var text = $scope.searchText;

            $scope.changeTimer = setTimeout(function() {
                $scope.$apply(function() {
                    $scope.resultSearch = User.search_skip_limit({}, { name: text, limit: 6, skip: 0 }, $scope.advanceSearchCallback_);
                    $scope.changeTimer = false;
                });
            }, 700);

            // скрываем правую панель
            $rootScope.$broadcast('hideRightPanel');
        } else {
            if($scope.changeTimer !== false) clearTimeout($scope.changeTimer);
            
            // показываем правую панель
            $rootScope.$broadcast('showRightPanel');
        }
    }
}

