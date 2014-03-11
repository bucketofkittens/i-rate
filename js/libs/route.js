
/** Роутинг **/
pgrModule.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
          when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController',
            reloadOnSearch: false
          }).
          when('/confirm_signup/:hash', {
            templateUrl: 'views/confirm.html',
            controller: 'ConfirmController',
            reloadOnSearch: false
          }).
          otherwise({
            redirectTo: '/'
          });
    }
]);