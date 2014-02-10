'use strict';

/**
 * Параметры для социальных сетей
 * @type {Object}
 */
var SocialConfig = {
	facebook: {
        applicationId: {
            "localhost": "205232122986999",
            "xmpp.dev.improva.com": "173391222849160",
            "i-rate.com": "181043732091838"
        },
        perms: "email,user_birthday,user_location,user_about_me"
    },
    googlePlus: {
        applicationId: {
            "localhost": '339940198985.apps.googleusercontent.com', 
            "xmpp.dev.improva.com": "339940198985-h79e4hvjp9b2658og8o849u3blaootub.apps.googleusercontent.com",
            "i-rate.com": "339940198985-c9idb0ng4letjpfnhsm4l7jci1uh7t6c.apps.googleusercontent.com"
        },
        apiKey: 'AIzaSyBUJ3rialFIcJ5QvuWFkvPqmFbTBIZ2Kmo',
        scopes: [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    },
    live: {
        redirect_uri: "http://i-rate.com/",
        client_id: "000000004410A030",
        scope: ["wl.signin", "wl.basic", "wl.emails", "wl.birthday"]
    }
}

// Название социальных сетей
var SocialNames = {
    FACEBOOK: "facebook",
    GOOGLE_PLUS: "google_plus",
    MSLIVE: "mslive",
    IMPROVA: "improva"
}


/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module(
	'pgrModule', 
	[ 
		"ngRoute", 
		"ngCookies",
		"ngResource",
		"ngAnimate",
		"ngSanitize",
    "ngQuickDate",
		'ngTouch', 
		"localization",
		"googleplus",
		"facebook",
    'rzModule',
    'ui.keypress',
    'vcRecaptcha',
    'ui.select2'
	]
);

/** Роутинг **/
pgrModule.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
          when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController',
            reloadOnSearch: false
          }).
          when('/graphs', {
            templateUrl: 'views/graphs.html',
            controller: 'GraphsController',
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

// добавляем в ajax token в заголовок
pgrModule.factory('httpRequestInterceptor', function() {
  return {
    request: function (config) {
    	var token = lscache.get("token") ? lscache.get("token") : "";
    	var user = lscache.get("user") ? lscache.get("user").sguid : "";

    	if(!config.headers) {
    		config.headers = {};
    	}

    	config.headers['AUTH_TOKEN'] = token.split('"').join("");
    	config.headers['REMOTE_USER'] = user.split('"').join("");
    	
      	return config;
    }
  };
});

pgrModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);

pgrModule.config(function(GooglePlusProvider) {
     GooglePlusProvider.init({
       clientId: SocialConfig.googlePlus.applicationId[window.location.hostname],
       apiKey: SocialConfig.googlePlus.apiKey
     });
});