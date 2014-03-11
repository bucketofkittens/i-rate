/**
 * Контроллер страны лиг
 */
function LeaguesController($scope, $location, $rootScope, User, LocationService, LeagueService) {
    // определяем показываем ли мы панель или нет
    $scope.show = $location.search().leagues ? true : false;

    $scope.currentLeague = -1;

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function (event, next) {
        $scope.show = $location.search().leagues ? true : false;

        if($location.search().leagues && $location.search().league && $scope.leagues && $scope.currentLeague != $location.search().league) {
            $scope.loadUsersByLeague($location.search().league);
        }

        if($location.search().leagues && !$location.search().league && $scope.leagues.length > 0) {
            $scope.selectLeague($scope.leagues[0].sguid);
            $scope.loadUsersByLeague($location.search().league);
        }

        $scope.currentLeague = $location.search().league;
    });

    // массив пользователь выбранной лиги
    $scope.leagueUsers = [];

    // массив лиг
    $scope.leagues = [];

    // забираем данные по лигам
    $rootScope.$broadcast('reloadLeagues');

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

    // выбираем нужную нам лигу
    $scope.selectLeague = function(sguid) {
        LocationService.update("league", sguid);
    }

    $scope.loadUsersByLeague = function(sguid) {
        $scope.setState(sguid);

        User.by_league({league_guid:sguid}, {}, $scope.selectLeagueCallback_);
    }

    // callback после загрузки пользователей для текущей лиги
    $scope.selectLeagueCallback_ = function(data) {
        $scope.leagueUsers = data;
        $scope.leagueUsers.sort(function(a, b) {
                if(a.points < b.points) return 1;
                if(a.points > b.points) return -1;
                return 0;
            });
        $scope.selectUser($scope.leagueUsers[0]);
    }
}