pgrModule.filter('removewhite', function () {
    return function(text) {
        return text.split(" ").join("");
    }
})