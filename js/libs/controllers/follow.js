/**
 * Контроллер панели друзей  
 */
function FollowController($scope, $rootScope) {

    // открываем планшку с пользователем
    $scope.openUser = function(userItem) {
        $rootScope.$broadcast('hideRightPanel');
        $rootScope.$broadcast('closeAllGoals');
        $rootScope.$broadcast('showUserProfile', { user: userItem });
    }
    /*
    $scope.compareState = 1;
    
    $scope.onCompare = function(user) {
        var noCl = false;
        if($location.search().user1) {
            if($scope.compareState == 1) {
                if($location.search().user2 != user.sguid && $location.search().user1 != user.sguid) {
                    $scope.compareState = 2;
                    $location.path("/compare").search(
                        {
                            user1: $location.search().user2, 
                            user2: user.sguid
                        }
                    );
                } else {
                    noCl = true;
                }
            } else {
                if($location.search().user1 != user.sguid && $location.search().user2 != user.sguid) {
                    $scope.compareState = 1;
                    $location.path("/compare").search(
                        {
                            user1: $location.search().user2, 
                            user2: user.sguid
                        }
                    );
                } else {
                    noCl = true;
                }
            }
        } else {
            if($scope.workspace.user && $scope.workspace.user.sguid) {
                if($scope.workspace.user.frends.length > 0) {
                    $location.path("/compare").search(
                        {
                            user1: $scope.workspace.user.frends[0].user.sguid, 
                            user2: user.sguid
                        }
                    );
                } else {
                    $location.path("/compare").search(
                        {
                            user1: $scope.workspace.user.sguid, 
                            user2: user.sguid
                        }
                    );
                }
                    
            } else {
                if($scope.tmpFollows[0].user.sguid != user.sguid) {
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: user.sguid});
                } else {
                    User.for_main({}, {}, function(data) {
                        var index = getRandomInt(0, data.length-1);
                        $location.path("/compare").search({user1: data[index].sguid, user2: user.sguid})
                    });
                }
            }
        }
        if(!noCl) {
            $rootScope.$broadcast('loaderShow');    
        }
    };
    */
}