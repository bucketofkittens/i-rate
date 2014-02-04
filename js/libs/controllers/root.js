/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 */
function RootController($scope, FacebookService, СareerService, LeagueService, CountryService, NeedsService, FriendsService, UserService, User, $rootScope, Needs, Social, $location, UserService) {
    
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
     * @type {[type]}
     */
    $scope.workspace.friends = $scope.workspace.user && $scope.workspace.user.friends ? $scope.workspace.user.friends : FriendsService.getList();

    this.needsServiceCallback_ = function(data) {
        $scope.workspace.needs = data;
        СareerService.getList($scope.workspace.needs, this.careerServiceCallback_);
    }

    this.careerServiceCallback_ = function(data) {
        $scope.workspace.careers = data;
    }

    this.countryServiceCallback_ = function(data) {
        $scope.workspace.country = data;
    }

    this.leagueServiceCallback_ = function(data) {
        $scope.workspace.leagues = data;
    }
    
    // список нидсов
    NeedsService.getList((this.needsServiceCallback_).bind(this));
    
    // список стран
    CountryService.getList(this.countryServiceCallback_);
    
    // список лиг
    LeagueService.getList(this.leagueServiceCallback_);


    $scope.openProfile = function() {
        $rootScope.$broadcast('openProfile');
    }
}