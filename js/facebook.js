var options = {};

/**
 * googleplus module
 */
angular.module("facebook", []).provider("Facebook", [ function() {
    this.init = function(params) {
    };
    
    this.$get = [ "$q", "$rootScope", "$timeout", function(a, b, c) {
        var d = a.defer();
        var e = function() {};
        return new e();
    } ];
} ]).run([ function() {
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
} ]);