function ShortLoaderController($scope, $element) {
    var opts = {
      lines: 9, // The number of lines to draw
      length: 3, // The length of each line
      width: 24, // The line thickness
      radius: 34, // The radius of the inner circle
      corners: 0, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: ['#4a5875'], // #rgb or #rrggbb or array of colors
      speed: 0.7, // Rounds per second
      trail: 90, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner',
      zIndex: 99,
      top: 'auto',
      left: 'auto'
    };

    var spinner = new Spinner(opts).spin($element.find(".loader")[0]);
}