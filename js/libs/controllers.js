'use strict';




function LeaguesController($scope, Leagues, User) {
    $scope.leagues = [];

    /**
    * Забираем запросом список лиг.
    * @param  {[type]} data [description]
    * @return {[type]}      [description]
    */
    Leagues.query({}, {}, function(data) {
        data = data.reverse();

        $scope.leagues = data;
        angular.forEach($scope.leagues, function(value, key){
           User.by_league({league_guid: value.sguid}, {}, function(v2, k2) {
                v2 = v2.filter(function(value) {
                    if(value.published == 1) {
                        return value;
                    }
                });
                value.users = v2;
            })
        });
    })
}









function FollowCaruselController($scope) {
    $scope.position = 0;
    $scope.countFrend = 0;

    $scope.onLeft = function() {
        $scope.position -= 1;
    }

    $scope.onRight = function() {
        $scope.position += 1;
    }

    $scope.$watch("frends", function (newVal, oldVal, scope) {
        $scope.countFrend = newVal.length;
    });
}







