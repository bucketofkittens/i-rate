/**
 * Контроллер страницы редактирования лиги
 * @param {[type]} $scope [description]
 */
function NSIController($scope, Leagues, $rootScope, $timeout, LeagueService) {

    /**
     * Добавляем новую лигу
     */
    $scope.addLeague = function() {
        $rootScope.$broadcast('openModal', { name: 'nsi-add'});

        $timeout(function(){
            $rootScope.$broadcast('nseAddOpen', { size: $scope.workspace.leagues.length});
        }, 100);
    }

    /**
     * Удаление лиги
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.delete = function(value) {
        Leagues.del({id: value.sguid}, {}, function(data) {
            $rootScope.$broadcast('reloadLeagues');
        }); 
    }

    /**
     * Закрываем окошко и иницилизируем пересчет пользователей
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.ok = function(value) {
        $rootScope.$broadcast('loaderShow');

        Leagues.recal({}, {}, function(data) {
            $rootScope.$broadcast('closeModal');
            $rootScope.$broadcast('loaderHide');
            $rootScope.$broadcast('reloadLeagues');
            location.reload();
        }); 
    }

    /**
     * Обновление лиги
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.update = function(value) {

        Leagues.updateLeague(
            {id: value.sguid}, 
            {
                "league": JSON.stringify({
                    max_border: value.max_border,
                    min_border: value.min_border,
                    name: value.name,
                    size: value.size
                })
            }, function(data) {

            }
        );
    }

    $rootScope.$broadcast('reloadLeagues');
}