/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 */
function RootController($scope, FacebookService, СareerService, LeagueService, CountryService, NeedsService, FriendsService, UserService, User, $rootScope,  $location, UserService, $location) {
    
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

    $scope.workspace.isAdmin = UserService.isAdminCache();

    /**
     * Забираем юзера из кеша
     * @type {[type]}
     */
    $scope.workspace.user = null;

    $scope.needsServiceCallback_ = function(data) {
        $scope.workspace.needs = data;
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

    $scope.openProfile = function() {
        $rootScope.$broadcast('openProfile');
    }

    $scope.openLeagues = function() {
        $location.search( { leagues: true } );
    }

    $scope.getAuthDataCallback_ = function(data) {
        $scope.workspace.user = data;
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
    
    $scope.$on('careerLoad', function(event) {
        if(!$scope.workspace.careers) {
            СareerService.getList($scope.workspace.needs, $scope.careerServiceCallback_);
        }
    });
    
    UserService.getAuthData($scope.getAuthDataCallback_);

    $scope.location = $location.path().replace("/", "");

    $scope.$on('$locationChangeSuccess', function(event) {
        $scope.location = $location.path().replace("/", "");
    });
}