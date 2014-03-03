require.config({
    baseUrl: "js",
    paths: {
        'angular': 'angular.min',
        'angular-route': 'angular-route.min',
        'angularAMD': 'angularAMD',
        'angular-resource': 'angular-resource.min',
        'angular-select2': 'angular-resource.min',
        'angular-cookies': 'angular-cookies.min',
        'angular-animate': 'angular-animate.min',
        'jquery': 'jquery-2.0.3.min',
        'ngload': 'lib/ngload.min'
    },
    shim: {
        'angularAMD': ['angular'],
        'ngload': ['angularAMD']
    },    
    deps: ['libs/app']
});