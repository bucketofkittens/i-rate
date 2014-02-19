function UserCommentsController($scope, Comments, $rootScope) {
    $scope.form = {
        message: ""
    }

    $scope.commentsList = [];
    
    $scope.onClose = function() {
        $rootScope.$broadcast('closeComments');  
    }

    $scope.openComments = function() {
    	$rootScope.$broadcast('loaderShow');
        $scope.getMessages();
    }

    $scope.getMessages = function() {
        Comments.get_by_user({owner_guid: $scope.user.sguid, owner_type: 0}, {}, function(data) {
            angular.forEach(data, function(value, key){
                value.post_date = moment(value.post_date).format("DD-MM-YYYY");
            });
            
            $scope.commentsList = data;
            $rootScope.$broadcast('loaderHide');
        });
    }

    $scope.onSendMessage = function() {
        $rootScope.$broadcast('loaderShow');
        Comments.create({}, {
            owner_type: 0,
            author_guid: $scope.workspace.user.sguid,
            post_date: moment().format("DD-MM-YYYY"),
            message: $scope.form.message,
            owner_guid: $scope.user.sguid
        }, function(data) {
            $rootScope.$broadcast('loaderHide');
            $scope.getMessages();
            $scope.form.message = "";
        });
    }

    $scope.openComments();
}