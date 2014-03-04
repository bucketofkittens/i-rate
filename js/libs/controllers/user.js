/**
 * Контроллер  профиля
 */
function UserController($scope, FriendsService, UserService, $element, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Leagues, $location, $window, LocationService) {
    // данные пользователя
    $scope.user = null;

    // под каким route в search будем искать id пользователя
    $scope.route = '';

    // является ли пользователь другом
    $scope.isFriend = false;

    // открывать большую карточку или нет
    $scope.big = false;

    // текущий выбранный так
    $scope.tab = 1;

    // индикатор прогресса загрузки данных. нужен для того что бы не дублировались ajax запросы
    $scope.getProgressFlag = false;

    $scope.$on('$locationChangeStart', function(event, newLoc, oldLoc) {
        $scope.setCurrentUser();
    });

    // меняем таб на другой
    $scope.onChangeTab = function(tab) {
        $scope.tab = tab;
    }

    // указываем текущего выбранного пользователя
    $scope.setCurrentUser = function() {
        // новый id по указанному rpute в ng-init
        var newId = $location.search()[$scope.route];

        // проверяем а нужно ли вообще менять id
        if(newId && (!$scope.user || $scope.user.sguid != newId) && !$scope.getProgressFlag) {
            $scope.getProgressFlag = true;
            UserService.getById(newId, $scope.userServiceGetByIdCallback_);
        }

        // если нет id то удаляем данные 
        if(!newId) {
            $scope.user = null;
        }
        $scope.big = $location.search().big && $location.search().big == $scope.route ? true : false;
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
        $scope.big = false;
        $location.search($scope.route, null);
        $rootScope.$broadcast('closeUserPanel', {route: $scope.route});

        LocationService.update("big", false);
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
        $rootScope.$broadcast('toggleNeed', {needItem: needItem, state: needItem.hidden ? false : true});
    }

    // открываем модальное окно репорта
    $scope.openReport = function() {
        $rootScope.$broadcast('openModal', {name: "report"});
    }

    // загружаем список нидсов
    $rootScope.$broadcast('needsLoad');
}