/**
 * Контроллер  профиля
 */
function UserController($scope, FriendsService, UserService, User, $location, LocationService, $rootScope, $element) {
    // данные пользователя
    $scope.user = null;

    // под каким route в search будем искать id пользователя
    $scope.route = '';

    // является ли пользователь другом
    $scope.isFriend = false;

    // текущий выбранный таб
    $scope.tab = 1;

    // видна ли кнопочка репорта или нет
    $scope.isReport = false;

    $scope.cacheId = null;

    $scope.$on('$locationChangeSuccess', function(event, newLoc, oldLoc) {
        $scope.setCurrentUser();
    });

    // calback для скрытия 
    this.windowClickCallback_ = function(event) {
        if(!$(event.target).hasClass("button")) {
            $scope.isReport = false;
        }
    }

    $(window).on("click", this.windowClickCallback_);

    // меняем таб на другой
    $scope.onChangeTab = function(tab) {
        $scope.tab = tab;
    }

    $scope.addViewCallback_ = function(newId) {
        UserService.getById(newId, $scope.userServiceGetByIdCallback_);
    }

    // указываем текущего выбранного пользователя
    $scope.setCurrentUser = function() {

        // новый id по указанному rpute в ng-init
        var newId = $location.search()[$scope.route];

        // проверяем а нужно ли вообще менять id
        if(newId && (!$scope.user || $scope.user.sguid != newId) && $scope.cacheId != newId) {
            $scope.cacheId = newId;
            UserService.getById(newId, $scope.userServiceGetByIdCallback_);

            if(($scope.workspace.user && newId != $scope.workspace.user.sguid) || !$scope.workspace.user) {
                UserService.addView(newId, $scope.addViewCallback_);    
            }
        }

        // если нет id то удаляем данные 
        if(!newId) {
            $scope.user = null;
        }
    }

    // callback получения данных пользователя
    $scope.userServiceGetByIdCallback_ = function(data) {
        $scope.getProgressFlag = false;

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
        $scope.user.likes += 1;
    }

    // callback после удаления пользователя из друзей
    $scope.unfollowCallback_ = function(friends) {
        $scope.workspace.friends = friends;
        $scope.isFriend = false;
        $scope.user.likes -= 1;
    }

    /** Событие добавление в друзья */
    $scope.onFollow = function() {
        if($scope.workspace.user) {
            FriendsService.follow($scope.user, $scope.workspace.friends, $scope.followCallback_);    
        }
    }

    /** Событие удаление из друзей */
    $scope.onUnFollow = function() {
        if($scope.workspace.user) {
            FriendsService.unfollow($scope.user, $scope.workspace.friends, $scope.unfollowCallback_);
        }
    }

    // показываем или скрываем список голов
    $scope.onShowGoals = function($event, needItem) {
        $rootScope.$broadcast('toggleNeed', {needItem: needItem, state: needItem.hidden ? false : true});
    }

    // открываем модальное окно репорта
    $scope.openReport = function() {
        $scope.isReport = false;

        $rootScope.$broadcast('openModal', {name: "report"});
        LocationService.update("report_user", $scope.user.sguid);
    }

    $scope.changeReport = function() {
        $scope.isReport = !$scope.isReport;
    }

    // загружаем список нидсов
    $rootScope.$broadcast('needsLoad');
}