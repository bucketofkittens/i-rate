/** Контроллер графика */
function GraphsController($scope, $rootScope, $route, $location, Leagues, User) {
    /**
     * Сурово и беспощадно.
     * Надо будет переписать
     * @return {[type]} [description]
     */
    setInterval(function() {
        var key = 0;
        $.each($("#graphs tr"), function(key, value){ 
            key += 1;
            $.each($(value).find("td"), function(keyd, valued){
                var a = 10;
                var points = parseInt($(valued).attr("data-points"));
                var step = ($(valued).attr("data-step"))*10000;
                if(points) {
                    if(points != 0) {
                        $(valued).find("a").css("top", (step-points)/100+"%");
                        $(valued).find("a").attr("data-sp", (step-points)/100);
                    } else {
                        $(valued).find("a").css("top", "100%");
                    }
                } else {
                    $(valued).find("a").css("top", "100%");
                }
                $(valued).find("a").css("z-index", key);
            })
        })
    }, 100);

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
    User.get_all({}, {}, function(datas) {
        $scope.looserUser = datas.filter(function(item) {
            if(item.points == 0) {
                return item;
            }
        });
    });

    $scope.openUser = function(userItem) {
        $rootScope.$broadcast('closeAllGoals');
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }

    $rootScope.$broadcast('reloadLeagues');
}