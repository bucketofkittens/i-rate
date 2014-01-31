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
     * Не отфильтрованный список всех пользователей
     * @type {Array}
     */
    $scope.usersCollections = [];

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

    /**
     * Скрывать поиск при клике вне него
     * @todo по хорошему надо переписать!
     * @return {[type]} [description]
     */
    $("body").on("click", function() {
        if($scope.id != "adv") {
            $scope.$apply(function() {
                $scope.resultSearch = [];
                $scope.searchText = "";
            });    
        }
    });

    $scope.$on('updatePubliched', function($event) {
       $scope.usersCollections = [];
    });

    $scope.test_ = function() {
        angular.forEach($scope.usersCollections, function(value, key) {
            var reg = new RegExp($scope.searchText.replace("[", "\\[").replace("]", "\\]"), "i");
            if(value.name && value.name != null && value.name != "null" && reg.test(value.name)) {
                value.points = parseInt(value.points);
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

    $scope.onSearch = function() {
        if($scope.searchText.length > 0) {
            $rootScope.$broadcast('updateSearchText', {text: $scope.searchText});
            $scope.resultSearch = [];
            if($scope.usersCollections.length == 0) {
                User.for_main({}, {}, function(data) {
                    $scope.usersCollections = data;
                    $scope.test_();
                });  
            } else {
                $scope.test_();
            }
            $rootScope.$broadcast('hideRightPanel');
        } else {
            $scope.resultSearch = [];
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

    $scope.$watch("id", function (newVal, oldVal, scope) {
        if(newVal == "adv" && $location.search().text) {
            $scope.searchText = $location.search().text;
            $scope.onSearch();
        }
    });
}