/**
 * Контроллер страницы расширенного поиска
 */
function SearchAdvanceController($scope, $location, $rootScope, User, Professions, CityByState, Leagues, $timeout, LocationService, $timeout, СareerService, ProfessionService) {
    /**
     * Тект поиска
     * @type {[type]}
     */
    $scope.searchText = $location.search().text;

    $scope.skip = 0;

    $scope.limit = 15;

    $scope.timer = null;

    $scope.topFilter = false;

    // определяем показываем ли мы панель или нет
    $scope.showTest = function() {
        $scope.show = $location.search().search  ? true : false;

        if($scope.show) {
            // загружаем список лиг
            $rootScope.$broadcast('reloadLeagues');

            // загружаем список стран
            $rootScope.$broadcast('countryLoad');

            // загружаем список карьер
            $rootScope.$broadcast('needsLoad');
            
            $rootScope.$broadcast('careersLoad'); 
            
            $rootScope.$broadcast('professionsLoad'); 
        }
    }

    $scope.showTest();

    // событие показа панелии
    $scope.$on('$locationChangeSuccess', function () {
        $scope.showTest();
    });

    $scope.loaderShow = true;

    // показываем все елементы в списке
    $scope.showAll = function(list) {
        angular.forEach(list, function(value, key){
            value.show = true;
        });

        return list;
    }

    $scope.showRight = true;

    /**
     * Модель данных расширенного поиска
     * @type {Object}
     */
    $scope.search = {
        career: {},
        profession: {},
        country: {},
        city: {},
        league: {},
        score: [0, 175000]
    };


    /**
     * Состояние выпадающих меню
     * @type {Object}
     */
    $scope.shows = {
        career: false,
        profession: false,
        country: false,
        city: false, 
        league: false
    }

    /**
     * Список профессий
     * @type {Object}
     */
    $scope.professionList = {};

    /**
     * Список городов
     * @type {Object}
     */
    $scope.cityList = {};

    /**
     * Список стран
     * @type {Object}
     */
    $scope.countriesList = {};

    /**
     * Список стран
     * @type {Object}
     */
    $scope.careerList = {};

    /**
     * Список гоалсов
     * @type {Object}
     */
    $scope.topList = [];
    
    $scope.$watch('workspace.professions', function (newVal, oldVal, scope) {
        if($scope.workspace.professions) {
            angular.forEach($scope.workspace.professions, function(value, key) {
                value.show = true;
            });
            
            $scope.professionList = $scope.workspace.professions;
        }
    });
    
    $scope.$watch('workspace.careers', function (newVal, oldVal, scope) {
        if($scope.workspace.careers) {
            angular.forEach($scope.workspace.careers, function(value, key) {
                value.show = true;
            });
            
            $scope.careerList = $scope.workspace.careers;
        }
    });

    $scope.clearLeagueParam = function() {
        $scope.score = [0, 175000];

        selectParam('league', '', true);
    }

    /**
     * Скрывать все списоки при клике вне него
     * @todo по хорошему надо переписать!
     * @return {[type]} [description]
     */
    $("body").on("click", function(e) {
        if(!$(e.target).hasClass("searcher") && !$(e.target).hasClass("search")) {
            $scope.$apply(function() {
                $scope.shows = {
                    career: false,
                    profession: false,
                    country: false,
                    city: false, 
                    league: false
                }
            });  
        }
          
    });

    /**
     * Показываем все елементы списка.
     * @param  {[type]} listName [description]
     * @return {[type]}          [description]
     */
    $scope.showAllListElement = function(listName) {
        angular.forEach($scope[listName], function(value, key){
            value.show = true;
        });
    }

    $scope.$watch("workspace.country", function (newVal, oldVal, scope) {
        $scope.countriesList = $scope.workspace.country;
        $scope.showAllListElement('countriesList');
    });

    $scope.$watch("workspace.needs", function (newVal, oldVal, scope) {
        if($scope.workspace.needs) {
            var needs = JSON.parse(JSON.stringify($scope.workspace.needs));
        
            angular.forEach(needs, function(need, key) {
                angular.forEach(need.goals, function(goal, key) {
                    goal.show = true;
                    goal.needName = need.name;
                    $scope.topList.push(goal);
                });
            });    
        }
    });

    // таймер отправки запроса на сервер
    $scope.changeMinTimer = false;

    // таймер отправки запроса на сервер
    $scope.changeMaxTimer = false;

    /**
     * Событие изменения maxScore
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("search.score", function (newVal, oldVal, scope) {
        $scope.collapseLeague();

        if(newVal && newVal != oldVal) {
            if($scope.changeMinTimer !== false) clearTimeout($scope.changeMinTimer);

            $scope.changeMinTimer = setTimeout(function() {
                $scope.$apply(function() {
                    $scope.advanceSearch();
                    $scope.changeMinTimer = false;
                });
            }, 700);
        }
    });

    /**
     * Изменяем top
     */
    $scope.selectTopParam = function(paramName, value) {
        $scope.selectParam(paramName, value);

        // очищаем профессию если сменилась карьера
        $scope.toggleShowState("top");
    }

    /**
     * Скидываем лигу
     * @return {[type]} [description]
     */
    $scope.collapseLeague = function() {
        $scope.search.league = {};
    }

    /**
     * Метод очищает все текущие выбранные значения в форме
     * @return {[type]} [description]
     */
    $scope.clearAll = function() {
        $scope.search = {
            career: {},
            profession: {},
            country: {},
            city: {},
            league: {},
            score: [0,  175000]
        };

        $scope.shows = {
            career: false,
            profession: false,
            country: false,
            city: false, 
            league: false
        }

        $scope.advanceSearch();
    }

    /**
     * В модель расширенного поиска передаем новые данные выбранные из выпадающего списка
     * @param  {[type]} paramName [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    $scope.selectParam = function(paramName, value, isNotToggle) {
        $scope.search[paramName] = value;
        if(!isNotToggle) {
            $scope.toggleShowState(paramName);
        }

        $scope.advanceSearch();
    }

    $scope.selectDateParam = function(paramName, value, isNotToggle) {
        $scope.selectParam(paramName, value, isNotToggle);

        setTimeout(function() {
            $.datepicker._clearDate($("#"+paramName));
        }, 0);
    }

    /**
     * Указывает новую лигу
     * @param  {[type]}  paramName   [description]
     * @param  {[type]}  value       [description]
     * @param  {Boolean} isNotToggle [description]
     * @return {[type]}              [description]
     */
    $scope.selectLeagueParam = function(paramName, value, isNotToggle) {
        var leagueName = 10 - parseInt(value.name);
        $scope.search.score = [value.min_border, value.max_border]

        $timeout(function(){
            $scope.selectParam(paramName, value);
            $scope.disableShowState(paramName);
        }, 0);

        $scope.advanceSearch();
    }

    /**
     * Меняем постояние параметра param на обратное
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */ 
    $scope.toggleShowState = function(param) {
        $scope.shows[param] = $scope.shows[param] ? false : true;
    }

    /**
     * Показываем выпадающий спслк
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    $scope.enableShowState = function(param) {
        $scope.shows[param] = true;
    }

    /**
     * Убираем выпадающий спслк
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    $scope.disableShowState = function(param) {
        $scope.shows[param] = false;
    }

    /**
     * Изменяем карьеру
     * @param  {[type]} paramName [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    $scope.selectCareerParam = function(paramName, value) {
        $scope.selectParam(paramName, value);
    }

    /**
     * Изменяем карьеру
     * @param  {[type]} paramName [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    $scope.selectContryParam = function(paramName, value) {
        $scope.selectParam(paramName, value);
        $scope.getCityByContry_(value.sguid, $scope.getCityByContryCallback_);

        // очищаем город если сменилась страна
        $scope.selectParam("city", "");
        $scope.toggleShowState("city");
    }

    /**
     * Получаем список профессий для текущей карьеры
     * @param  {[type]} careerId  [description]
     * @param  {[type]} callback_ [description]
     * @return {[type]}           [description]
     */
    $scope.getProfessionByCareer_ = function(careerId, callback_) {
        Professions.query({ id: careerId }, {}, callback_);
    }

    /**
     * callback после получения списка профессий для текущей карьеры
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.getProfessionByCareerCallback_ = function(data) {
        $scope.professionList = data;
        $scope.showAllListElement('professionList');
    }

    /**
     * Получаем список профессий для текущей карьеры
     * @param  {[type]} careerId  [description]
     * @param  {[type]} callback_ [description]
     * @return {[type]}           [description]
     */
    $scope.getCityByContry_ = function(contryId, callback_) {
        CityByState.query({ id: contryId }, {}, callback_);
    }

    /**
     * callback после получения списка профессий для текущей карьеры
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.getCityByContryCallback_ = function(data) {
        $scope.cityList = data;
        $scope.showAllListElement('cityList');
    }

    /**
     * Транслирует модель параметров в тот вид что нужен backend-у
     * @return {[type]} [description]
     */
    $scope.translateParamsToServer_ = function() {
        var params = {};

        if($scope.searchText) {
            params["name"] = $scope.searchText;
        }
        if($scope.search.career && $scope.search.career.sguid) {
            params["career_guid"] = $scope.search.career.sguid;
        }
        if($scope.search.country && $scope.search.country.sguid) {
            params["state_guid"] = $scope.search.country.sguid;
        }
        if($scope.search.city && $scope.search.city.sguid) {
            params["city_guid"] = $scope.search.city.sguid;
        }
        if($scope.search.profession && $scope.search.profession.sguid) {
            params["profession_guid"] = $scope.search.profession.sguid;
        }
        if($scope.search.league && $scope.search.league.sguid) {
            params["league_guid"] = $scope.search.league.sguid;
        }
        if($scope.search.birthday_from) {
            params["birthday_from"] = moment($scope.search.birthday_from).format("DD/MM/YYYY");
        }
        if($scope.search.birthday_till) {
            params["birthday_till"] = moment($scope.search.birthday_till).format("DD/MM/YYYY");
        }
        if($scope.search.score) {
            params["points_from"] = $scope.search.score[0];
            params["points_till"] = $scope.search.score[1];
        }
        if($scope.search.top) {
            params["goal_id"] = $scope.search.top.sguid;
            $scope.topFilter = true;
        } else {
            $scope.topFilter = false;
        }
        
        if($scope.searchText) {
            params["name"] = $scope.searchText;
        }

        params["skip"] = $scope.skip;

        params["limit"] = $scope.limit;

        return params;
    }

    /**
     * Функция расширенного поиска
     * @return {[type]} [description]
     */
    $scope.advanceSearch = function() {
        if($scope.timer !== false) clearTimeout($scope.timer);

        $scope.timer = setTimeout(function() {
            $scope.$apply(function() {
                $scope.skip = 0;
                $rootScope.$broadcast('updateLeftSearchList', {data: []});

                User.search_skip_limit({}, $scope.translateParamsToServer_(), $scope.advanceSearchCallback_);
            });
        }, 700);
    }

    $scope.updateOnScrollEvents = function($event, isEndEvent) {
        if(isEndEvent) {
            $scope.skip += $scope.limit;

            User.search_skip_limit({}, $scope.translateParamsToServer_(), $scope.advanceSearchPushCallback_);
        }
    }

    
    $scope.advanceSearchCallback_ = function(data) {
        $rootScope.$broadcast('updateLeftSearchList', {data: data});
    }

    $scope.advanceSearchPushCallback_ = function(data) {
        $rootScope.$broadcast('updateLeftSearchPushList', {data: data});
    }

    /**
     * Параметры календарей
     * @type {Object}
     */
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0',
        dateFormat: 'dd/mm/yy',
        showOn: 'button'
    };

    /**
     * Событие изменения в поле поиска текста
     */
    $scope.$on('updateSearchText', function($event, message) {
        $scope.searchText = message.text;
    });

    $scope.$on('advanceSearch_', function($event, message) {
        $scope.searchText = message.searchText;
        $scope.advanceSearch();
    });

    /**
     * Фильтрует и показывает указанный выпадающий список
     * @param  {[type]} listName [description]
     * @return {[type]}          [description]
     */
    $scope.filteredList = function(listName, filteredText, showParam) {
        var countView = 0;
        if($scope[listName].length > 0 && filteredText.length > 0) {
            angular.forEach($scope[listName], function(value, key) {
                var reg = new RegExp(filteredText, "i");
                if(reg.test(value.name)) {
                    $scope.enableShowState(showParam);
                    value.show = true;
                    countView += 1;
                } else {
                    value.show = false;
                }
            });
            if(countView == 0) {
                $scope.disableShowState(showParam);
            }
        } else {
            $scope.showAllListElement(listName);
            $scope.disableShowState(showParam);
        }
    }

    $scope.close = function() {
        $location.search({});
    }

    // открываем профиль
    $scope.openSearchProfile = function(user) {
        $scope.showRight = false;
        user.current = true;

        LocationService.update("search_profile", user.sguid);
    }

    // если есть search_profile в location тогда открывает его профиль
    if($location.search().search_profile) {
        $scope.openProfile($location.search().search_profile);
        $scope.showRight = false;
    }

    // если закрываем панель пользователя тогда показываем панель справа в поиске
    $scope.$on('closeUserPanel', function () {
        $scope.showRight = true;
    });

    // настройки календаря
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };
    
}
