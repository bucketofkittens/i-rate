// контроллер работы с колбасами в чужом профиле
function UserNeedsController($scope, $rootScope) {
    // открываем критерий
    $scope.showCriterias = function($event, needItem, goalItem, needs) {
        $rootScope.$broadcast('toggleCriteria', {
                goalItem: goalItem,
                state: goalItem.current ? false : true
            }
        );
    }

    // меняем состояние критерия
    $scope.$on('toggleCriteria', function(event, message) {
        var currentGoal = null;
        angular.forEach($scope.needs, function(value, key){
            angular.forEach(value.goals, function(gValue, gKey){
                if(gValue.sguid == message.goalItem.sguid) {
                    currentGoal = gValue;
                }
            });
        });

        if(!currentGoal.current) {
            $scope.$parent.getCriteriumByGoal(currentGoal); 
        } 

        currentGoal.current = currentGoal.current ? false : true;
    });

    // меняем состояние показа нидсов
    $scope.$on('toggleNeed', function(event, message) {
        angular.forEach($scope.needs, function(value, key){
            if(value.sguid == message.needItem.sguid) {
                value.hidden = message.state;
            }
        });
    });

    $scope.$watch('needs', function (newVal, oldVal, scope) {
        if($scope.needs) {
            angular.forEach($scope.openGoals, function(value, key) {
                angular.forEach($scope.needs, function(nValue, nKey){
                    angular.forEach(nValue.goals, function(gValue, gKey){
                        if(gValue.sguid == value.sguid) {
                            gValue.current = true;
                            $scope.$parent.getCriteriumByGoal(gValue); 
                        }
                    });
                });
            });
        }
    });
}