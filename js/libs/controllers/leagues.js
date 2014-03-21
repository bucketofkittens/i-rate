/**
 * Контроллер страны лиг
 */
function LeaguesController($scope, $location, $rootScope, User, LocationService, LeagueService) {

    $scope.skip = 0;

    $scope.limit = 15;

    $scope.testLeague = function() {
        // определяем показываем ли мы панель или нет
        $scope.show = $location.search().leagues ? true : false;
        if($scope.show) {
            // забираем данные по лигам
            $rootScope.$broadcast('reloadLeagues');
        }
    }
    

    $scope.currentLeague = -1;

    // массив пользователь выбранной лиги
    $scope.leagueUsers = [];

    // массив лиг
    $scope.leagues = [];

    $scope.testLeague();

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event, next) {
        $scope.testLeague();

        if($location.search().leagues && $location.search().league && $scope.leagues && $scope.currentLeague != $location.search().league) {
            $scope.loadUsersByLeague($location.search().league);
        }

        if($location.search().leagues && !$location.search().league && $scope.leagues.length > 0) {
            $scope.selectLeague($scope.leagues[0].sguid);
            $scope.loadUsersByLeague($location.search().league);
        }

        $scope.currentLeague = $location.search().league;
    });

    // забираем список лиг, сортируем и сразу выбираем первую лигу )
    $scope.$watch('workspace.leagues', function (newVal, oldVal, scope) {
        if($scope.workspace.leagues) {
            $scope.leagues = JSON.parse(JSON.stringify($scope.workspace.leagues));
            $scope.leagues.sort(function(a, b) {
                if(a.position < b.position) return 1;
                if(a.position > b.position) return -1;
                return 0;
            });

            if($location.search().leagues && !$location.search().league && $scope.leagues.length > 0) {
                $scope.selectLeague($scope.leagues[0].sguid);
            }

            if($location.search().leagues && $location.search().league) {
                $scope.setState($location.search().league);
            }
        }
    });

    // выбор нужного пользователя
    $scope.selectUser = function(value) {
        $scope.usersAllNotCurrent();
        value.current = true;
        LocationService.update("league_user", value.sguid);
    }

    // делаем все лиги не текущими
    $scope.closeAllLeague_ = function() {
        angular.forEach($scope.leagues, function(value, key) {
            value.current = false;
        });
    }


    // все пользоваетли false
    $scope.usersAllNotCurrent = function() {
        angular.forEach($scope.leagueUsers, function(value, key) {
            value.current = false;
        });
    }

    // устанавливанем состояние лиги
    $scope.setState = function(sguid) {
        $scope.closeAllLeague_();
        var league = LeagueService.getLeagueById(sguid, $scope.leagues);
        if(league) {
            league.current = true;   
        }
    }

    $scope.updateOnScrollEvents = function(event, isEndEvent) {
        if(isEndEvent) {
            $scope.skip += $scope.limit;
            User.by_league_and_limit({league_guid:$location.search().league, skip: $scope.skip, limit: $scope.limit}, {}, $scope.leagueCallback_);
        }
    }

    // выбираем нужную нам лигу
    $scope.selectLeague = function(sguid) {
        $scope.skip = 0;
        LocationService.update("league", sguid);
        $(".user_list").scrollTop(0);
        $(".user_list").perfectScrollbar('update');
    }

    $scope.loadUsersByLeague = function(sguid) {
        $scope.setState(sguid);

        User.by_league_and_limit({league_guid:sguid, skip: $scope.skip, limit: $scope.limit}, {}, $scope.selectLeagueCallback_);
    }

    // callback после загрузки пользователей для текущей лиги
    $scope.selectLeagueCallback_ = function(data) {
        data = data.filter(function(value) {
            if(value.published) {
                return value;
            }
        });
        
        data.sort(function(a, b) {
            if(a.points < b.points) return 1;
            if(a.points > b.points) return -1;
            return 0;
        });

        $scope.leagueUsers = data;
        $scope.selectUser($scope.leagueUsers[0]);
    }

    $scope.leagueCallback_ = function(data) {
        data = data.filter(function(value) {
            if(value.published) {
                return value;
            }
        });
        
        data.sort(function(a, b) {
            if(a.points < b.points) return 1;
            if(a.points > b.points) return -1;
            return 0;
        });

        $scope.leagueUsers = $scope.leagueUsers.concat(data);
    }

    $scope.$on('closeUserPanel', function (event, message) {
        if(message.route == "league_user") {
            $location.search({});
        }
    });
}