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

        // отправляем полученные данные в событие
        $rootScope.$broadcast('userGetById', { user: data, route: $scope.route });

        // определяем друг пользователь или нет
        $scope.isFriend = FriendsService.isFriend($scope.user, $scope.workspace.friends);
    }

    // закрывает плашку с текущим пользователем
    $scope.close = function() {
        $location.search($scope.route, null);
        $rootScope.$broadcast('closeUserPanel', {route: $scope.route});
    }

    // инициализация контрллера
    $scope.init = function(route) {
        $scope.route = route;

        // забираем данные пользователя
        $scope.setCurrentUser();
    }

    // callback после добавления пользователя в друзья
    $scope.followCallback_ = function(friends) {
        $scope.workspace.friends = friends;
        $scope.isFriend = true;
    }

    // callback после удаления пользователя из друзей
    $scope.unfollowCallback_ = function(friends) {
        $scope.workspace.friends = friends;
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

    // показываем или скрываем список голов
    $scope.onShowGoals = function($event, needItem) {
        needItem.hidden = needItem.hidden ? false : true;
    }
}

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