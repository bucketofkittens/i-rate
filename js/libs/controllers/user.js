/**
 * Контроллер  профиля
 */
function UserController($scope, FriendsService, UserService, User, $location, LocationService, $rootScope) {
    // данные пользователя
    $scope.user = null;

    // под каким route в search будем искать id пользователя
    $scope.route = '';

    // является ли пользователь другом
    $scope.isFriend = false;

    // текущий выбранный таб
    $scope.tab = 1;

    // индикатор прогресса загрузки данных. нужен для того что бы не дублировались ajax запросы
    $scope.getProgressFlag = false;

    // видна ли кнопочка репорта или нет
    $scope.isReport = false;

    $scope.$on('$locationChangeStart', function(event, newLoc, oldLoc) {
        $scope.setCurrentUser();
    });

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
        if(newId && (!$scope.user || $scope.user.sguid != newId) && !$scope.getProgressFlag) {
            $scope.getProgressFlag = true;

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

        if(data && moment(data.birthday)) {
            data.birthday = moment(data.birthday).format("DD.MM.YYYY");    
        }

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
        $rootScope.$broadcast('openModal', {name: "report"});
        LocationService.update("report_user", $scope.user.sguid);
    }

    // загружаем список нидсов
    $rootScope.$broadcast('needsLoad');
}