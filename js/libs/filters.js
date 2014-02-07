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

