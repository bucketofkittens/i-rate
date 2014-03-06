pgrModule.filter('removewhite', function () {
    return function(text) {
        return text.split(" ").join("");
    }
})

pgrModule.filter('notnull', function () {
    return function(text) {	
        return !text ? 0 : text;
    }
})


pgrModule.filter('int', function () {
    return function(text) {	
        return parseInt(text);
    }
})

pgrModule.filter('title', function () {
    return function(value) {	
        return value.name ? value.login + ", " + value.name : value.login;
    }
})

pgrModule.filter('unidate', function () {
    return function(value) {
        if(value) {
            return value.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        }
    }
})


