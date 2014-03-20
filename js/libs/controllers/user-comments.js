// Вкладка комментариев на странице пользователя
function UserCommentsController($scope, Comments, $rootScope) {
    $scope.form = {
        message: ""
    }

    $scope.disable = true;

    $scope.commentsList = [];
    
    $scope.onClose = function() {
        $rootScope.$broadcast('closeComments');  
    }

    $scope.openComments = function() {
        $scope.getMessages();
    }

    $scope.getMessages = function() {
        Comments.get_by_user({owner_guid: $scope.user.sguid, owner_type: 0}, {}, function(data) {
            angular.forEach(data, function(value, key) {
                value.post_date = moment.utc(value.post_date).format("MMM DD, YYYY h:mm a");
            });
            
            $scope.commentsList = data;
        });
    }

    // если сменился пользователь меняем данные
    $scope.$watch('user', function (newVal, oldVal, scope) {
        if(newVal != oldVal) {
            $scope.getMessages();
        }
    });

    $scope.changeText = function() {
        if($scope.form.message.length > 0) {
            $scope.disable = false;
        } else {
            $scope.disable = true;
        }
    }

    // отправка сообщения
    $scope.onSendMessage = function() {
        if($scope.form.message.length > 0 && $scope.workspace.user) {
            Comments.create({}, {
                owner_type: 0,
                author_guid: $scope.workspace.user.sguid,
                post_date: moment().format("DD-MM-YYYY HH:mm:ss"),
                message: $scope.form.message,
                owner_guid: $scope.user.sguid
            }, function(data) {
                $rootScope.$broadcast('loaderHide');
                $scope.getMessages();
                $scope.form.message = "";

                $rootScope.$broadcast('commentsScrollTop');
            });
        }
    }

    $scope.openComments();
}