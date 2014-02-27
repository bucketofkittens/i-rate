/**
 * Контроллер комментаев
 * @param {[type]} $scope       [description]
 * @param {[type]} $rootScope   [description]
 * @param {[type]} Comments     [description]
 * @param {[type]} $routeParams [description]
 */
function CommentsController($scope, $rootScope, Comments, $routeParams, $location) {
    $scope.user = null;
    $scope.form = {
        message: ""
    }

    $scope.commentsList = [];
    
    $scope.onClose = function() {
        $rootScope.$broadcast('closeComments');  
    }

    $scope.$on('openComments', function($event, message) {
        $scope.user = $location.search().user;

        $scope.getMessages();
    });

    $scope.getMessages = function() {
        Comments.get_by_user({owner_guid: $scope.user, owner_type: 0}, {}, function(data) {
            angular.forEach(data, function(value, key){
                value.post_date = moment(value.post_date).format("DD-MM-YYYY");
            });
            
            $scope.commentsList = data;
        });
    }

    $scope.onSendMessage = function() {
        console.log($scope.form.message.length);
        if($scope.form.message.length > 0) {
            Comments.create({}, {
                owner_type: 0,
                author_guid: $scope.workspace.user.sguid,
                post_date: moment().format("DD-MM-YYYY"),
                message: $scope.form.message,
                owner_guid: $scope.user
            }, function(data) {
                $rootScope.$broadcast('loaderHide');
                $scope.getMessages();
                $scope.form.message = "";
            });    
        }
    }
}