/** Контроллер графика */
function GraphsController($scope, $rootScope, $route, $location, Leagues, User) {

    $scope.$watch('workspace.leagues', function (newVal, oldVal, scope) {
        angular.forEach($scope.workspace.leagues, function(value, key){
            User.by_league({league_guid:value.sguid}, {}, function(v2, k2){
                v2.sort(function(a, b) {
                    if(a.points < b.points) return 1;
                    if(a.points > b.points) return -1;
                    return 0;
                })
                var users = v2;
                if(users.length < 10) {
                    var i = 0;
                    for(i = users.length; i <= 10; i++) {
                        users.push({});
                    }
                }
                value.users = users;
            })
        });
    });

    /**
     * Забираем список всех пользователей и выбираем только тех у которых 0 пользователей
     * @param  {[type]} datas [description]
     * @return {[type]}       [description]
    */
    User.without_points({}, {}, function(datas) {
        $scope.looserUser = datas;
    });
 
    $scope.openUser = function(userItem) {
        $rootScope.$broadcast('closeAllGoals');
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }

    $rootScope.$broadcast('reloadLeagues');
}