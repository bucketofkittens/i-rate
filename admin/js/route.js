
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
          when('/approve', {
            templateUrl: 'admin/views/approve.html',
            controller: 'ApproveController',
            reloadOnSearch: false
          }).
          otherwise({
            redirectTo: '/nsi'
          });
    }
]);

pgrModule.factory('httpRequestInterceptor', function() {
  return {
    request: function (config) {
      var token = lscache.get("admin_token") ? lscache.get("admin_token") : lscache.get("token") ? lscache.get("token") : "";
      var user = lscache.get("user") ? lscache.get("user") : "";

      if(!config.headers) {
        config.headers = {};
      }

      if(user && token) {
        config.headers['TOKEN'] = token.split('"').join("");
        config.headers['USER'] = user.split('"').join("");
      }
      
      return config;
    }
  };
});