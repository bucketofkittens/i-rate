
/** Роутинг **/
pgrModule.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
          when('/graphs', {
            templateUrl: 'admin/views/graphs.html',
            controller: 'GraphsController',
            reloadOnSearch: false
          }).
          when('/nsi', {
            templateUrl: 'admin/views/nsi.html',
            controller: 'NSIController',
            reloadOnSearch: false
          }).
          when('/nsi-add', {
            templateUrl: 'admin/views/nsi-add.html',
            controller: 'NSIAddController',
            reloadOnSearch: false
          }).
          when('/reports', {
            templateUrl: 'admin/views/reports.html',
            controller: 'ReportsController',
            reloadOnSearch: false
          }).
          otherwise({
            redirectTo: '/nsi'
          });
    }
]);