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


