    /**
 * Контроллер страны лиг
 */
function LeaguesController($scope, $location, $rootScope, User, LocationService, LeagueService) {

    $scope.showUser = $scope.phone ? false : true;

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

    $scope.timeoutId = null;

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

    $scope.clickSelectUser = function(value) {
        $scope.showUser = true;
        $scope.selectUser(value);
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

    $scope.updateOnScrollEvents = function(event) {
        /*
        if($scope.timeoutId) clearTimeout($scope.timeoutId);
        $scope.timeoutId = setTimeout(function() {
            $scope.$apply(function() {
                $scope.skip += $scope.limit;
                
            });
          
        }, 30);
        */
    }

    $("body").on("touchmove mousewheel", $scope.updateOnScrollEvents);

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
        
        if(data.length > 0) {
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

            $scope.skip += $scope.limit;

            $scope.leagueUsers = data;
            $scope.selectUser($scope.leagueUsers[0]);    

            User.by_league_and_limit({league_guid:$location.search().league, skip: $scope.skip, limit: $scope.limit}, {}, $scope.leagueCallback_);
        }
    }

    $scope.leagueCallback_ = function(data) {
        if(data.length > 0) {
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

            $scope.skip += $scope.limit;

            $scope.leagueUsers = $scope.leagueUsers.concat(data);
            
            User.by_league_and_limit({league_guid:$location.search().league, skip: $scope.skip, limit: $scope.limit}, {}, $scope.leagueCallback_);
        }
    }

    $scope.$on('closeUserPanel', function (event, message) {
        if(message.route == "league_user") {
            if($scope.phone) {
                $scope.showUser = false;
            } else {
              $location.search({});    
            }
        }
        
    });

    $scope.iphoneEvent = function() {
        if(!$scope.showUser) {
            $location.search({}); 
        } else {
            $scope.showUser = false;
        }
    }
}