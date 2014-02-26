/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 */
function RootController($scope, FacebookService, СareerService, LeagueService, CountryService, NeedsService, FriendsService, UserService, User, $rootScope, Needs, Social, $location, UserService, AllUserService, SocialService, FacebookService) {
    
    /**
     * Открывает модальное окно
     * @param  {[type]} nameModal название модального окна
     * @return {[type]}           [description]
     */
    $scope.showModal = function(nameModal) {
        $rootScope.$broadcast('openModal', { name: nameModal});
    }

    /**
     * Массив всяких данных
     * @type {Object}
     */
    $scope.workspace = {};

    /**
     * Забираем юзера из кеша
     * @type {[type]}
     */
    $scope.workspace.user = UserService.getAuthData();

    $scope.workspace.users = {};

    // забираем список друзей
    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }

    // если пользователь есть в кеше забираем список его друзей с сервера
    if($scope.workspace.user) {
        UserService.getFriends($scope.workspace.user.sguid, $scope.getFriendsCallback_);
    }

    /**
     * Массив хренения списка друзей для не авторизованного пользователя
     */
    $scope.workspace.friends = $scope.workspace.user && $scope.workspace.user.friends ? $scope.workspace.user.friends : FriendsService.getList();

    $scope.needsServiceCallback_ = function(data) {
        $scope.workspace.needs = data;
        СareerService.getList($scope.workspace.needs, $scope.careerServiceCallback_);
    }

    $scope.careerServiceCallback_ = function(data) {
        $scope.workspace.careers = data;
    }

    $scope.countryServiceCallback_ = function(data) {
        $scope.workspace.country = data;
    }

    $scope.leagueServiceCallback_ = function(data) {
        $scope.workspace.leagues = data;
    }

    $scope.userServiceCallback_ = function(data) {
        $scope.workspace.users = data;
    }

    $scope.openProfile = function() {
        $rootScope.$broadcast('openProfile');
    }

    // событие загрузки списка нидсов
    $scope.$on('needsLoad', function(event) {
        // список нидсов
        NeedsService.getList($scope.needsServiceCallback_);
    });

    // событие загрузки списка стран
    $scope.$on('countryLoad', function(event) {
        // список стран
        CountryService.getList($scope.countryServiceCallback_);
    });

    // событие загрузки списка лиг
    $scope.$on('countryLoad', function(event) {
        // список лиг
        LeagueService.getList($scope.leagueServiceCallback_);
    });

    // событие загрузки пользвателей
    $scope.$on('usersLoad', function(event) {
        // список пользвателей
        UserService.getAll($scope.userServiceCallback_);
    });
    
    FacebookService.init();
}