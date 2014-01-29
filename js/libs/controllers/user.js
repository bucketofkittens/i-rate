/**
 * Контроллер  профиля
 */
function UserController($scope, FriendsService, UserService, $element, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Leagues, $location, $window) {
    // данные пользователя
    $scope.user = null;

    // под каким route в search будем искать id пользователя
    $scope.route = '';

    // является ли пользователь другом
    $scope.isFriend = false;

    $scope.newImage = null;
    $scope.bindIn = "";
    $scope.hidden = false;

    // событие переключчения состояния страницы.
    $scope.$on('$locationChangeSuccess', function () {
        $scope.setCurrentUser();
    });

    // указываем текущего выбранного пользователя
    $scope.setCurrentUser = function() {
        // новый id по указанному rpute в ng-init
        var newId = $location.search()[$scope.route];

        // проверяем а нужно ли вообще менять id
        if(newId && (!$scope.user || $scope.user.sguid != newId)) {
            UserService.getById(newId, $scope.userServiceGetByIdCallback_);
        }

        // если нет id то удаляем данные 
        if(!newId) {
            $scope.user = null;
        }
    }

    // callback получения данных пользователя
    $scope.userServiceGetByIdCallback_ = function(data) {
        $scope.user = data;

        // определяем друг пользователь или нет
        $scope.isFriend = FriendsService.isFriend($scope.user, $scope.workspace.friends);
    }

    // закрывает плашку с текущим пользователем
    $scope.close = function() {
        $location.search($scope.route, null);
    }

    // инициализация контрллера
    $scope.init = function(route) {
        $scope.route = route;

        // забираем данные пользователя
        $scope.setCurrentUser();
    }

    // callback после добавления пользователя в друзья
    $scope.followCallback_ = function() {
        $scope.isFriend = true;
    }

    // callback после удаления пользователя из друзей
    $scope.unfollowCallback_ = function() {
        $scope.isFriend = false;
    }

    /** Событие добавление в друзья */
    $scope.onFollow = function() {
        FriendsService.follow($scope.user, $scope.workspace.friends, $scope.followCallback_);
    }

    /** Событие удаление из друзей */
    $scope.onUnFollow = function() {
        FriendsService.unfollow($scope.user, $scope.workspace.friends, $scope.unfollowCallback_);
    }
    

    /**Событие клика на пользователе в сравнении 
    $scope.onUserClick = function(user, $event) {
        if($scope.compare && user.sguid != AuthUser.get()) {
            if(user.hover == true) {
                user.hover = false;
            } else {
                user.hover = true;
            }
        }
    }
*/
    /*
    $scope.$on('$locationChangeSuccess', function(location) {
        if($scope.bindIn == "user2") {
            $("sub.du, sup.du").remove();
            $scope.userId = $location.search().user2;
            $scope.getUserInfo();
        } else {
            $("sub.du, sup.du").remove();
            $scope.userId = $location.search().user1;
            $scope.getUserInfo();
        }

        if($routeParams.userId1) {
            $("sub.du, sup.du").remove();
            $scope.userId = $routeParams.userId1;
            $scope.getUserInfo();
        }

        if($location.search().user) {
            $("sub.du, sup.du").remove();
            $scope.userId = $location.search().user;
            $scope.getUserInfo();
        }
    });
    */

/*
    $scope.onCompareUser = function() {
        if($scope.workspace.user && $scope.workspace.user.sguid) {
            $location.path("/compare").search({user1: $scope.workspace.user.sguid, user2: $scope.userId});
        } else {
            if($scope.tmpFollows.length > 0) {
                if($scope.tmpFollows[0].user.sguid != $scope.userId) {
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: $scope.userId});
                } else {
                    var index = getRandomInt(0, data.length-1);
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: data[index].sguid});
                }
            } else {
                User.for_main({}, {}, function(data) {
                    var index = getRandomInt(0, data.length-1);
                    $location.path("/compare").search({user1: data[index].sguid, user2: $scope.userId})
                });
                
            }
        }
    }

    $scope.professionFn = function(query) {
        return $.map($scope.professions, function(profession) {
            return profession.name;
        });
    }
*/

    

    /** Событие перехода к пользователю
    $scope.onMoveToProfile = function(user) {
        $location.path("/profile/").search({user: user.sguid});;
    }

    

    $scope.$on('updateUserControllerId', function($event, message) {
        if(message.id == $scope.id) {
            if(message.userId) {
                $scope.currentUserId = message.userId;
                $scope.getUserInfo();
            }

            if(!angular.isUndefined(message.isEdit)) {
                $scope.isEdit = message.isEdit;
            }
        }
    });
    

    $scope.$on('updateLegue', function() {
        User.update_legue({id: AuthUser.get()}, {
            points: $scope.user.points
        }, function(data) {
            $rootScope.$broadcast('updateUserLegueAndPoints');
        });
    });
 */
    /**
     * Событие обновления лиги у пользователя
     * @return {[type]} [description]
   
    $scope.$on('updateUserLegueAndPoints', function() {
        User.query({id: $scope.currentUserId}, $.proxy($scope.userLegueAndPointsUpdate_, $scope));
    });
  */
    /**
     * Обновляет данные лиги у пользователя
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
  
    $scope.userLegueAndPointsUpdate_ = function(data) {
        $scope.user.league = data.league;
        $scope.user.points = data.points;

        $rootScope.workspace.user.league = data.league;
        $rootScope.workspace.user.points = data.points;
    }
   */
    /**
     * Событие при изменении критерия
     * @return {[type]} [description]
  
    $scope.$on('userCriteriaUpdate', function() {
        $rootScope.$broadcast('updateLegue');
    });

    $scope.$on('updateUser', function() {
        $scope.getUserInfo();
    });
   */
    /**
     * Список годов
     * @param  {[type]} min [description]
     * @param  {[type]} max [description]
     * @return {[type]}     [description]
  
    this.generateAgesArray = function(min, max) {
        var i = min, ret = [];
        for(i = min; i <= max; i++){
            ret.push(i);
        }
        return ret;
    }

    $scope.ages = this.generateAgesArray(14, 150);

    $scope.onCompare = function(id) {
        $location.path('/compare/'+id);
    }

    $scope.onBack = function($event) {
        $window.history.back();
    }
   */
    /**
     * 
     * @param {type} $event
     * @param {type} elementId
     * @returns {undefined}

    $scope.onEditActivate = function($event, elementId) {
        angular.element(".form-control").attr("disabled", "disabled");
    
        var elm = angular.element("#"+elementId)[0];
        if(elm.getAttribute("disabled")) {
            elm.removeAttribute("disabled");
            elm.focus();
        } else {
            elm.setAttribute("disabled", "disabled");
        }   
    };


    $scope.onElementClick = function($event) {
        var elm = $($event.target);
        $("input[type='text'], input[type='email'], select", ".pmpar").attr("readonly", "readonly");
        $(elm).attr("readonly", false);
        $(elm).focus();
    };
    
     */
    /**
     * [onReadFile description]
     * @param  {[type]} $event
     * @return {[type]}

    $scope.onReadFile = function($event) {
        $rootScope.$broadcast('cropImage');
    }
     */
    /**
     * 
     * @param  {[type]} $event
     * @return {[type]}
     
    $scope.onUpdateFile = function($event) {
        $("#photo_crop").click();
    }

    $scope.onUpdateGoalImage = function($event) {
        $("#goal_done").html("");
        var data = new FormData();
        data.append("picture", $("#goal_image")[0].files[0]);
        data.append("owner_type", 3);

        $.ajax({
            url: host+'/pictures/'+$("#goal_id").val(),
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'PUT'
        }).done(function(data) {
            $("#goal_done").html("done");
        });
    }

    $scope.getProfessionByName = function(name) {
        var filtered = $scope.professions.filter(function(value) {
            if(value.name == name) {
                return value;
            }
        });

        return filtered;
    }

    if($scope.workspace && $scope.workspace.user) {
        $scope.authUser = $scope.workspace.user;
        $scope.testFollow();
    }*/
}