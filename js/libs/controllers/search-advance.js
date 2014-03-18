/**
 * Контроллер страницы расширенного поиска
 */
function SearchAdvanceController($scope, $location, $rootScope, User, Professions, CityByState, Leagues, $timeout, LocationService, $timeout, СareerService, ProfessionService) {
    /**
     * Тект поиска
     * @type {[type]}
     */
    $scope.searchText = $location.search().text;

    // определяем показываем ли мы панель или нет
    $scope.showTest = function() {
        $scope.show = $location.search().search  ? true : false;    
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
        minScore: 0,
        maxScore: 175000
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

    $scope.clearLeagueParam = function() {
        $scope.search.minScore = 0;
        $scope.search.maxScore = 175000;

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
        var needs = JSON.parse(JSON.stringify($scope.workspace.needs));
        
        angular.forEach(needs, function(need, key) {
            angular.forEach(need.goals, function(goal, key) {
                goal.show = true;
                goal.needName = need.name;
                $scope.topList.push(goal);
            });
        });
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
    $scope.$watch("search.minScore", function (newVal, oldVal, scope) {
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
     * Событие изменения maxScore
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("search.maxScore", function (newVal, oldVal, scope) {
        $scope.collapseLeague();

        if(newVal && newVal != oldVal) {
            if($scope.changeMaxTimer !== false) clearTimeout($scope.changeMaxTimer);

            $scope.changeMaxTimer = setTimeout(function() {
                $scope.$apply(function() {
                    $scope.advanceSearch();
                    $scope.changeMaxTimer = false;
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
            minScore: 0,
            maxScore: 175000
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
        $scope.search.minScore = value.min_border;
        $scope.search.maxScore = value.max_border;

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
        if($scope.search.minScore) {
            params["points_from"] = $scope.search.minScore;
        }
        if($scope.search.maxScore) {
            params["points_till"] = $scope.search.maxScore;
        }
        if($scope.search.top) {
            params["goal_id"] = $scope.search.top.sguid;
        }
        if($scope.searchText) {
            params["name"] = $scope.searchText;
        }

        return params;
    }

    /**
     * Функция расширенного поиска
     * @return {[type]} [description]
     */
    $scope.advanceSearch = function() {
        $scope.loaderShow = true;
        $rootScope.$broadcast('updateLeftSearchList', {data: []});

        User.search({}, $scope.translateParamsToServer_(), $scope.advanceSearchCallback_);
    }

    /**
     * Callback для поиска
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.advanceSearchCallback_ = function(data) {
        $scope.loaderShow = false;
        $rootScope.$broadcast('updateLeftSearchList', {data: data});
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
    $scope.openSearchProfile = function(sguid) {
        $scope.showRight = false;

        LocationService.update("search_profile", sguid);
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

    // загружаем список лиг
    $rootScope.$broadcast('reloadLeagues');

    // загружаем список стран
    $rootScope.$broadcast('countryLoad');

    // загружаем список карьер
    $rootScope.$broadcast('needsLoad');

    $scope.careerServiceCallback_ = function(data) {
        angular.forEach(data, function(value, key) {
            value.show = true;
        });
        $scope.careerList = data;
    }

    $scope.professionServiceCallback_ = function(data) {
        angular.forEach(data, function(value, key) {
            value.show = true;
        });
        $scope.professionList = data;
    }

    СareerService.getList($scope.careerServiceCallback_);
    ProfessionService.getList($scope.professionServiceCallback_);
    
}