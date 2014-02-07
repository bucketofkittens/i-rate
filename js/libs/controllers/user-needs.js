// контроллер работы с колбасами в чужом профиле
function UserNeedsController($scope) {
    // открываем критерий
    $scope.showCriterias = function($event, needItem, goalItem, needs) {
        if(!goalItem.current) {
            $scope.$parent.getCriteriumByGoal(goalItem); 
        } 

        goalItem.current = goalItem.current ? false : true;
        $scope.syncOpenAndClose($event, goalItem);
    }

    // синхронно открываем два одинаковых критерия
    $scope.syncOpenAndClose = function($event, goal) {
        if($event) {
            var element = $($event.currentTarget).find("a");

                if(element) {
                    var id = element.attr("data-goalid");
                    var items = $("a[data-goalid='"+id+"']");
                    var hasCurrent = $(element).hasClass("current");
                    
                    $.each(items, function(key, value) {
                        if($(value).attr("user-id") != $scope.user.sguid) {
                            if(
                                goal.current && !$(value).hasClass("current") ||
                                !goal.current && $(value).hasClass("current")) {

                                setTimeout(function() {
                                    $(value).parent().click();
                                }, 0);    
                            }
                        }
                    }
                );
            }   
        }
    }
}