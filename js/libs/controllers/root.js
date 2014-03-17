/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 */
function RootController($scope, FacebookService, СareerService, LeagueService, CountryService, NeedsService, FriendsService, UserService, User, $rootScope,  $location) {
    
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
    $scope.workspace.user = null;

    /**
     * Массив хренения списка друзей для не авторизованного пользователя
     */
    $scope.workspace.friends = [];

    $scope.isAdminCallback_ = function(data) {
        $scope.workspace.isAdmin = data;
    }

    // забираем профиль пользователя
    $scope.getAuthDataCallback_ = function(data) {
        $scope.workspace.user = data;

        UserService.isAdmin(data.sguid, $scope.isAdminCallback_);
        UserService.getFriends($scope.workspace.user.sguid, $scope.getFriendsCallback_);
    }

    // забираем список друзей
    $scope.getFriendsCallback_ = function(data) {
        $scope.workspace.friends = data;
    }
    
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

    $scope.openLeagues = function() {
        $location.search( { leagues: true } );
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
    $scope.$on('reloadLeagues', function(event) {
        // список лиг
        LeagueService.getList($scope.leagueServiceCallback_);
    });

    // событие загрузки пользвателей
    $scope.$on('usersLoad', function(event) {
        // список пользвателей
        UserService.getAll($scope.userServiceCallback_);
    });

    UserService.getAuthData($scope.getAuthDataCallback_);
    
    FacebookService.init();
}