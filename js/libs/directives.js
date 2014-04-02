(function($) { 
  $.fn.swipeEvents = function() {
    return this.each(function() {
      
      var startX,
          startY,
          $this = $(this);
      
      $this.bind('touchstart', touchstart);
      
      function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind('touchmove', touchmove);
          $this.bind('touchend', touchend);
        }
        event.preventDefault();
      }
      
      function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;
          
          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
            $this.unbind('touchmove', touchmove);
            $this.unbind('touchend', touchend);
          }
        }
        event.preventDefault();
      }
      
      function touchend(event) {
        $this.unbind('touchmove', touchmove);
        event.preventDefault();
      }
      
    });
  };
})(jQuery);

pgrModule.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.src, function (newVal, oldVal, scope) {
        if(!attrs.src) {
          element.attr('src', attrs.errSrc);
        }
      });
    }
  }
});

pgrModule.directive('cropClick', function() {
  return {
    link: function(scope, element, attrs) {
      $(element).on("click", function() {
        $("#photo_crop").click();
      });
    }
  }
});

pgrModule.directive('textsizechange', function() {
  return {
    link: function(scope, element, attrs) {
      $(element).on("keyup", function() {
        var commentElement = $(".comm");

        if(!commentElement.attr("basic-height")) {
          commentElement.attr("basic-height", $(commentElement).height());
        }

        commentElement.height(commentElement.attr("basic-height")-$(element).height()+20);
        

        $(element).perfectScrollbar('update');
      });
    }
  }
});

pgrModule.directive('sameAs', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var otherInput = elm.inheritedData("$formController")[attrs.sameAs];

      ctrl.$parsers.push(function(value) {
          if(value === otherInput.$viewValue) {
              ctrl.$setValidity("repeat", true);
              return value;
          }
          ctrl.$setValidity("repeat", false);
      });

      otherInput.$parsers.push(function(value) {
          ctrl.$setValidity("repeat", value === ctrl.$viewValue);
          return value;
      });
    }
  };
});

pgrModule.directive('positionGoal', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("goalItem.current_value", function (newVal, oldVal, scope) {
        $(element).width(scope.goalItem.current_value / (scope.goalItem.points_summary )*100+"%");
      });
    }
  }
});

pgrModule.directive('positionNeed', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("needItem.current_value", function (newVal, oldVal, scope) {
        $(element).width(scope.needItem.current_value / (scope.needItem.points_summary )*100+"%");
      });
    }
  }
});

pgrModule.directive('backImg', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe("backImg", function (newVal, oldVal, scope) {
        element.css({
            'background-image': 'url(' + newVal +')',
            'background-size' : '100% 100%'
        });
      });
      element.css({
          'background-image': 'url(' + attrs.backImg +')',
          'background-size' : '100% 100%'
      });
    }
  }
})

pgrModule.directive('commentScroll', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$on('commentsScrollTop', function($event, message) {
          $(element).animate({ scrollTop: 0 }, 600);
          $(element).perfectScrollbar('update');
      });
    }
  }
});

pgrModule.directive('positionGraph', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('points', function(data) {
        var percent = attrs.max/100;
        $(element).css("top", 100-attrs.points/percent+"%");
      });
    }
  }
});

pgrModule.directive('scrollUsers', function($rootScope, $location) {
  return {
    link: function(scope, element, attrs) {
      var size = 200;
      scope.changeTimer = null;

      $(element).on("scroll", function() {
        if(scope.changeTimer !== false) clearTimeout(scope.changeTimer);

        scope.changeTimer = setTimeout(function() {
          scope.$apply(function() {
            if($(element).scrollTop() > size) {
              $rootScope.$broadcast('showUserShort', {route: "user1"});
              $rootScope.$broadcast('showUserShort', {route: "user2"});
            } else {

              $rootScope.$broadcast('hideUserShort', {route: "user1"});
              $rootScope.$broadcast('hideUserShort', {route: "user2"});
            }
          });
        }, 100);
      });

      scope.$on('$locationChangeSuccess', function(event, newLoc, oldLoc) {
        if($location.search().user1 && $(element).scrollTop() > size) {
          $rootScope.$broadcast('showUserShort', {route: "user1"});
        } else {
          $rootScope.$broadcast('hideUserShort', {route: "user1"});
        }
        if($location.search().user2 && $(element).scrollTop() > size) {
          $rootScope.$broadcast('showUserShort', {route: "user2"});
        } else {
          $rootScope.$broadcast('hideUserShort', {route: "user2"});
        }
      });
    }
  }
});



pgrModule.directive('scrollUser', function($rootScope) {
  return {
    link: function(scope, element, attrs) {
      var size = 200;
      scope.changeTimer = null;

      $(element).on("scroll", function() {
        if(scope.changeTimer !== false) clearTimeout(scope.changeTimer);

        scope.changeTimer = setTimeout(function() {
          scope.$apply(function() {
            if($(element).scrollTop() > size) {
              $rootScope.$broadcast('showUserShort', {route: scope.route});
            } else {
              $rootScope.$broadcast('hideUserShort', {route: scope.route});
            }
          });
        }, 100);
      });
    }
  }
});


pgrModule.directive('scrolls', function() {
  return {
    link: function(scope, element, attrs) {
      $(element).on("scroll", function() {
        var elements = $("."+attrs.scrollsClass);
        $(elements).scrollTop($(element).scrollTop());
      });
    }
  }
})

pgrModule.directive('colbasa', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('colbasaCurrent', function(data) {
        $timeout(function() {
          var currentElement = $('li[data-id="'+attrs.colbasaCurrent+'"]', $(element).parent());
          var parentLi  = $(element).parent().find("li"),
              parentUl  = $(element).parent(),
              slider = parentUl.find("span");

          currentElement.removeClass("current");

          if($(currentElement).size() > 0 && currentElement.index() != 0) {
              var size = currentElement.get(0).offsetLeft + currentElement.get(0).clientWidth;
              if (size <  15) {
                  size = 0;
              }
              slider.css("width", size + "px");
          } else {
            var size = attrs.colbasaMin;
              slider.css("width", size);
          }
          
          var isCurrent = false;
          $.each(parentLi, function(key, value) {
              if(!isCurrent) {
                  $(value).addClass("white-text");
              } else {
                  $(value).removeClass("white-text");
              }
              
              if($(value).index() == currentElement.index()) {
                  isCurrent = true;
              }
          });

          if(!isCurrent) {
            $(element).parent().find("li").removeClass("white-text");
          }

          $(element).parent().show();
        }, 0);
      });
    }
  }
})

// сравнение пользователей
pgrModule.directive('comparator', function() {
  return {
    scope: {
    },
    link: function(scope, element, attrs) {
      // название роутингов пользователей
      var usersName = {
        USER1: "user1",
        USER2: "user2"
      }

      // название подставляемых классов
      var classes = {
        DOWN: 'down',
        UP: 'up',
        CENTER: 'same'
      };

      // событие изменения значений
      attrs.$observe('values', function(data) {
        if(data && data.length > 0) {
          var values = JSON.parse(data);

          element.removeClass(classes.DOWN).removeClass(classes.UP).removeClass(classes.CENTER);
          
          if(values[usersName.USER1] && values[usersName.USER2]) {
            if(values[usersName.USER1] > values[usersName.USER2]) {
              element.addClass(classes.DOWN);
            }
            if(values[usersName.USER1] < values[usersName.USER2]) {
              element.addClass(classes.UP);
            }
            if(values[usersName.USER1] == values[usersName.USER2]) {
              element.addClass(classes.CENTER);
            }
          } else {
            /*
            element.removeClass(classes.DOWN).removeClass(classes.UP).removeClass(classes.CENTER);

            if(!values[usersName.USER1] && values[usersName.USER2]) {
              element.addClass(classes.UP);
            }
            if(!values[usersName.USER2] && values[usersName.USER1]) {
              element.addClass(classes.DOWN);
            }
            */
          }
        } else {
          element.removeClass(classes.DOWN).removeClass(classes.UP).removeClass(classes.CENTER);
        }
      });
    }
  }
})

pgrModule.directive('scroller', function($window) {
  return {
    link: function(scope, element, attrs) {
      setTimeout(function() {
        $(element).height($(window).height()-$(element).offset().top);

        $(window).resize(function() {
          $(element).height($(window).height()-$(element).offset().top);
        });
      }, 0);
    }
  }
})

pgrModule.directive('scroller2', function($window) {
  return {
    link: function(scope, element, attrs) {
      setTimeout(function() {
        if($(window).height() < $(element).height()+$(element).offset().top) {
          $(element).height($(window).height()-$(element).offset().top);  
        }
        
        $(window).resize(function() {
          if($(window).height() < $(element).height()+$(element).offset().top) {
            $(element).height($(window).height()-$(element).offset().top);
          }
        });
      }, 0);
    }
  }
})

pgrModule.directive('scrollerStep', function($window) {
  return {
    link: function(scope, element, attrs) {
      $(element).height($(window).height()-attrs.scrollerStep);

      $(window).resize(function() {
        $(element).height($(window).height()-attrs.scrollerStep);
      });
    }
  }
})

pgrModule.directive('caruselPosition', function($window) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("position", function (newVal, oldVal, scope) {
        $(element).css("left", "-"+60*scope.position+"px");
      });
    }
  }
})

pgrModule.directive('showcrits', function($window) {
  return {
    link: function(scope, element, attrs) {
      $(element).on("swipeLeft", function($event) {
        if($(element).hasClass("show_crits")) {
          $(element).css("left", "-320px");
        }
      });
      $(element).on("swipeRight", function($event) {
        if($(element).hasClass("show_crits")) {
          $(element).css("left", "0px");
        }
      });
    }
  }
})



/**
 * Директива плитки на главной
 */
pgrModule.directive('masonry', function(User, $rootScope) {
  return {
    link: function($scope, element, attrs) {
      var parentElement = element.parent()[0];
      var is_load = false;
      
      // добавляем скроллинг мышкой
      /*
      $(parentElement).on("mousewheel DOMMouseScroll", function($event) {
        if(!self.is_load && self.view_count < self.total_count && $(parentElement).scrollTop()+$(parentElement).height() == $(parentElement)[0].scrollHeight) {
          self.view_count += self.limit;
          self.skip += self.limit;
          self.is_load = true;
          self.getUsersFromBackend(self, self.loadUserCallback_);
        }
      });
    */
      if($scope.phone) {
        $(parentElement).on("touchmove", function($event) {
          if(!self.is_load && self.view_count < self.total_count && $(parentElement).scrollTop()+$(parentElement).height() == $(parentElement)[0].scrollHeight) {
            self.view_count += self.limit;
            self.skip += self.limit;
            self.is_load = true;
            self.getUsersFromBackend(self, self.loadUserCallback_);
          }
        });
      }
        
      

      /** коэффициэнт количество элементов **/
      var limitCorruption = 30;

      var isiPad = navigator.userAgent.match(/iPad/i) != null;

      if(isiPad) {
        limitCorruption = 20;
      }
      
      /** Количество элементов на странице **/
      this.limit = parseInt($(window).height()/limitCorruption);
      
      /** текущий отступ  элементов **/
      this.skip = 0;
      
      /** сколько сейчас показано элементов **/
      this.view_count = 0;
      
      /** общее количество элементов **/
      this.total_count = null;
      
      /** есть ли элементы в кеше **/
      var isCached = true;

      // время жизни кеша с пользователям
      var cacheTime = 1440;

      var self = this;
      
      /** забираем список пользователей из кеша **/
      $rootScope.users = lscache.get("masonry");

      $("body").on("click", ".isotope-item", function(){
        var item = this;
        $scope.$apply(function() {
          $rootScope.$broadcast('showUserProfile', { user: { sguid: $(item).data("id") }  }); 
        });
      });
      
      /** инициализируем isotope **/
      this.initIso = function() {
        var size = 70;
        if($(window).width() < 500) {
          size = 40;
        }
        $(element).isotope({
          rowHeight: size,
          layoutMode: "perfectMasonry",
          animationEngine: 'css',
          perfectMasonry: {
              columnWidth: size,
              rowHeight: size
         }
        });
      }

      $scope.addCurrentUser = function() {
        var userElement = $scope.getUserByGuid($scope.workspace.user.sguid);
        if(userElement.size() == 0) {
          var item = $scope.addUser($scope.workspace.user);
          $(".isotope-item").eq(randomRange(0, 20)).before(item);
          $(element).isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });
        }
      }

      $scope.removeCurrentUser = function() {
        var userElement = $scope.getUserByGuid($scope.workspace.user.sguid);
        if(userElement.size() > 0) {
          $(element).isotope( 'remove', userElement );
        }
      }

      $scope.addUser = function(value) {
        if(value.avatar && value.league ) {
            if(value.artificial || !value.league.secure || (value.league.secure && !value.artificial && value.allowed_for_publish == 1)) {
              var newDiv = document.createElement('div');
              newDiv.className = 'item isotope-item iso-item all';
              newDiv.setAttribute("data-id", value.sguid);
              
              newDiv.style.width = value.league.size ? value.league.size+"px" : "0px";
              newDiv.style.height = value.league.size ? value.league.size+"px" : "0px";  

              if($(window).width() < 500) {
                newDiv.style.width = value.league.iphone_size ? value.league.iphone_size+"px" : "0px";
                newDiv.style.height = value.league.iphone_size ? value.league.iphone_size+"px" : "0px";  
              }

              var newSubDiv = document.createElement('div');
              newSubDiv.className = 'wr';

              newDiv.appendChild(newSubDiv);

              var img = document.createElement('img');
              img.src = value.avatar;
              img.width = value.league.size ? value.league.size : "70";
              img.height = value.league.size ? value.league.size : "70";

              if($(window).width() < 500) {
                img.width = value.league.iphone_size ? value.league.iphone_size : "40";
                img.height = value.league.iphone_size ? value.league.iphone_size : "40"; 
              }

              if(value.league.is_points) {
                var scoreSpan = document.createElement('span');
                if(value.league.font) {
                  scoreSpan.style.fontSize = value.league.font+"px";  
                }
                scoreSpan.innerHTML = unidate(parseInt(value.points).toString());
                newSubDiv.appendChild(scoreSpan);
              }

              newSubDiv.appendChild(img);
              return $scope.nodeToString(newDiv);
            }
          }
          return "";
      }

      $scope.getUserByGuid = function() {
        return $("div[data-id='"+$scope.workspace.user.sguid+"']", $(element));
      }

      $scope.currentUserUpdate = function() {
        if($scope.workspace.user.published) {
          
          if($scope.workspace.user.league.secure && !$scope.workspace.user.artificial && !$scope.workspace.user.allowed_for_publish) {
            $scope.removeCurrentUser();
          } else {
            $scope.addCurrentUser();
          }
        } else {
          $scope.removeCurrentUser();
        }
      }

      $scope.currentUserUpdatePoints = function() {
        if($scope.workspace.user.published) {
          var userElement = $scope.getUserByGuid($scope.workspace.user.sguid);
          if(userElement) {
            $(userElement).find("span").html($scope.workspace.user.points.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
          }
        }
      }

      $scope.currentUserUpdateAvatar = function() {
        if($scope.workspace.user.published) {
          var userElement = $scope.getUserByGuid($scope.workspace.user.sguid);
          if(userElement) {
            $(userElement).find("img").attr("src", $scope.workspace.user.avatar);
          }
        }
      }

      $scope.$watch("workspace.user.published", function (newVal, oldVal, scope) {
        if($scope.workspace.user) {
          $scope.currentUserUpdate();
        }
      });

      $scope.$watch("workspace.user", function (newVal, oldVal, scope) {
        if($scope.workspace.user) {
          $scope.currentUserUpdate();
        }
      });

      $scope.$on("updateLeague", function (newVal, oldVal, scope) {
        if($scope.workspace.user) {
          $scope.currentUserUpdate();
        }
      });

      $scope.$on("updateAvatar", function (newVal, oldVal, scope) {
        if($scope.workspace.user) {
          $scope.currentUserUpdateAvatar();
        }
      });

      $scope.$on("userCriteriaUpdate", function (newVal, oldVal, scope) {
        if($scope.workspace.user) {
          $scope.currentUserUpdatePoints();
        }
      });

      /** забираем список пользователей из backend-а **/
      this.getUsersFromBackend = function(self, callback) {
        User.for_main_from_limit({limit: self.limit, skip: self.skip}, {}, function(data) {
          callback(data, self, callback);
        });
      }

      this.loadUserCallback_ = function(data, self, callback) {
        var items = $scope.appendElements(data);
        self.is_load = false;

        $(items).imagesLoaded( function() {
          $(element).isotope("insert", $(items));
        });
      }

      this.firstLoadUserCallback_ = function(data, self, callback) {
        var items = $scope.appendElements(data);

        $(items).imagesLoaded( function() {
          $(element).isotope("insert", $(items));

          if(data[0] && data[0].total_count && !self.total_count)
            self.total_count = data[0].total_count;
         
          self.view_count += self.limit;
          if(!$scope.phone) {
            if(self.view_count < self.total_count) {
              self.skip += self.limit;

              self.getUsersFromBackend(self, callback);
            }
          } else {
            if(self.view_count < self.total_count && $(element).height() < $(window).height()) {
              self.skip += self.limit;

              self.getUsersFromBackend(self, callback);
            }
          }
        });
      }

      $scope.appendElements = function(data) {
        var items = "";

        angular.forEach(data, function(value, key) {
          items += $scope.addUser(value);
        });
        return items;
      }

      $scope.nodeToString = function(node) {
         var tmpNode = document.createElement( "div" );
         tmpNode.appendChild( node.cloneNode( true ) );
         var str = tmpNode.innerHTML;
         tmpNode = node = null; 
         return str;
      }


      /**
       * Забираем список пользователей
       */
      isCached = false;
      $scope.users = [];
      self.initIso();

      this.getUsersFromBackend(this, this.firstLoadUserCallback_);  
    }
  }
})

pgrModule.directive('mydash', function(User) {
  return {
    link: function(scope, element, attrs) {
      scope.centerTextDraw = null;
      scope.db2Draw = null;
      scope.needsLine = [];
      scope.carreeMax = 0;

      scope.updatePointText_ = function() {
        if(scope.workspace.user && scope.elements["CENTER_TEXT"]) {
          scope.elements["CENTER_TEXT"].setText(scope.workspace.user.points);
          scope.elements["CENTER_TEXT"].offsetY("-"+(scope.dashboard.getHeight()/2-30));
          scope.elements["CENTER_TEXT"].offsetX(scope.elements["CENTER_TEXT"].width()/2);

          scope.elements["CENTER_TEXT"].getLayer().draw();
        }
      }

      scope.drawSegmentPoints_ = function(positions, images, specialPosition, dotCorruptions) {
          if(images[0]) {
            var containerParams = {
              x: specialPosition ? specialPosition.x : scope.dashboard.getWidth()/2-images[0].width*0.6/2,
              y: specialPosition ? specialPosition.y : scope.dashboard.getHeight()/2-images[0].height*0.6/2,
              width: images[0].width,
              height: images[0].height
            };
            var container = new Kinetic.Layer(containerParams);

            var centerImgContainer =  new Kinetic.Image({
                image: images[0],
                x: 0,
                y: 0,
                name: "image1"
            });

            var centerImgDotContainer = new Kinetic.Image({
                image: images[1],
                x: dotCorruptions ? dotCorruptions.x : 0,
                y: dotCorruptions ? dotCorruptions.y : 0,
                name: "image2"
            });

            centerImgContainer.scale({x:0.6,y:0.6});
            centerImgDotContainer.scale({x:0.6,y:0.6});

            container.add(centerImgContainer);
            container.add(centerImgDotContainer);

            centerImgContainer.setZIndex(0);
            centerImgDotContainer.setZIndex(3);

            scope.dashboard.add(container);

            return container;
          }
      } 

      scope.drawText_ = function(image) {
          var containerParams = {
            x: scope.dashboard.getWidth()/2-image.width*0.6/2,
            y: scope.dashboard.getHeight()/2-image.height*0.6/2,
            width: image.width*0.6,
            height: image.height*0.6
          };
          var container = new Kinetic.Layer(containerParams);

          var centerImgContainer =  new Kinetic.Image({
              image: image,
              x: 0,
              y: -20,
              name: "image4"
          });

          centerImgContainer.scale({x:0.6,y:0.6});

          container.add(centerImgContainer);
          scope.dashboard.add(container);
      }

      scope.drawNewCenterArc_ = function() {
        var corruption = 90;
        var oneStep = 175000/360;
        var newAngle = degToRad(scope.workspace.user.points/oneStep+corruption);
        var baseAngle = degToRad(corruption);

        var centerRX = scope.dashboard.getWidth()/2-89;
        var centerRY = scope.dashboard.getHeight()/2-39.5;
        var endX = centerRX + Math.cos(newAngle) * 149;
        var endY = centerRY + Math.sin(newAngle) * 149;

        scope.elements["CENTER_ARC"] = new Kinetic.Shape({
            drawFunc: function(context) {
              var ctx = context.canvas.getContext()._context;
              var x = centerRX;
              var y = centerRY;
              var radius = 91;
              var startAngle = baseAngle;
              var endAngle = newAngle;
              var colorString = "rgba(170, 200, 255, 0.5)";

              ctx.beginPath();
              ctx.arc(x, y, radius, startAngle, endAngle, false);
              ctx.strokeStyle = colorString;
              ctx.lineWidth = 37;
              ctx.stroke();
              ctx.closePath();
              ctx.beginPath();
              ctx.moveTo(centerRX + Math.cos(newAngle) * (radius+18),centerRY + Math.sin(newAngle) * (radius+18));
              ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * radius,centerRY + Math.sin(newAngle+0.1) * radius);
              ctx.lineTo(centerRX + Math.cos(newAngle) * (radius-18),centerRY + Math.sin(newAngle) * (radius-18));
              ctx.fillStyle = colorString;
              ctx.strokeStyle = colorString;
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.fill();
              ctx.closePath();
          },
        });
      }

      scope.drawCenterArc_ = function() {
        if(!scope.db2Draw) {
          scope.db2Draw = scope.drawSegmentPoints_( 
            {x: 0, y: 0}, 
            [scope.preload.getResult("db2"), scope.preload.getResult("db2p")],
            null,
            {x: 9, y: 7}
          );
        }

        if(scope.workspace.user && scope.db2Draw) {
          if(scope.elements["CENTER_ARC"]) {
            scope.db2Draw.destroy();
            scope.elements["CENTER_ARC"] = null;
          }

          scope.db2Draw = scope.drawSegmentPoints_( 
            {x: 0, y: 0}, 
            [scope.preload.getResult("db2"), scope.preload.getResult("db2p")],
            null,
            {x: 9, y: 7}
          );
          
          scope.drawNewCenterArc_();
          scope.db2Draw.add(scope.elements["CENTER_ARC"]);
          scope.elements["CENTER_ARC"].setZIndex(1);
          scope.db2Draw.draw();
        }
      }

      scope.drawNeed_ = function(container, params) {
        if(container) {
          var corruption = params.corruption;
          var radius =  params.radius;
          var oneStep =  params.need_max/params.segment;

          if(params.need_max - params.need_value < 500) {
            var oneStep =  params.need_max/params.segmentMax;
          }
          var newAngle = degToRad(params.need_value/oneStep+corruption);
          var baseAngle = degToRad(corruption);

          var centerRX = scope.dashboard.getWidth()/2-params.centerX;
          var centerRY = scope.dashboard.getHeight()/2-params.centerY;
          var endX = centerRX + Math.cos(newAngle) * radius;
          var endY = centerRY + Math.sin(newAngle) * radius;

          var arc = new Kinetic.Shape({
              drawFunc: function(context) {
                var ctx = context.canvas.getContext()._context;
                var x = centerRX;
                var y = centerRY;
                var startAngle = baseAngle;
                var endAngle = newAngle;
                var colorString = "rgba(170, 200, 255, 0.5)";

                ctx.beginPath();
                ctx.rotate(degToRad(-1.5));
                ctx.arc(x, y, radius, startAngle, endAngle, false);
                ctx.strokeStyle = colorString;
                ctx.lineWidth = 36;
                ctx.stroke();
                ctx.closePath();

                if(params.need_max - params.need_value > 500) {
                  ctx.beginPath();
                  ctx.moveTo(centerRX + Math.cos(newAngle) * (radius+18),centerRY + Math.sin(newAngle) * (radius+18));
                  ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * radius,centerRY + Math.sin(newAngle+0.1) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle) * (radius-18),centerRY + Math.sin(newAngle) * (radius-18));
                  ctx.fillStyle = colorString;
                  ctx.lineWidth = 1;
                  ctx.fill();

                  ctx.closePath();
                }

            },
          });

          container.add(arc);
          arc.setZIndex(params.zIndex);
          container.draw();
          
          scope.needsLine.push(arc);
        }
      }

      scope.drawCenter_ = function(image) {
          scope.elements["CENTER_CONTAINER"] = new Kinetic.Layer();
          scope.elements["CENTER_IMAGE"] = new Kinetic.Image({
              image: image,
              x: scope.dashboard.getWidth()/2-image.width*0.6/2,
              y: scope.dashboard.getHeight()/2-image.height*0.6/2,
              name: "image"
          });
          
          scope.elements["CENTER_TEXT"] = new Kinetic.Text({
            text: '',
            fontSize: 25,
            fontFamily: 'Helvetica Neue Light',
            fill: '#ffffff',
            x: scope.dashboard.getWidth()/2,
            y: 60
          });

          scope.elements["CENTER_IMAGE"].scale({x:0.6,y:0.6});
          scope.elements["CENTER_TEXT"].scale({x:0.6,y:0.6});

          scope.elements["CENTER_CONTAINER"].add(scope.elements["CENTER_IMAGE"]);
          scope.elements["CENTER_CONTAINER"].add(scope.elements["CENTER_TEXT"]);

          scope.dashboard.add(scope.elements["CENTER_CONTAINER"]);
          scope.updatePointText_();
      }

      scope.setNeeds = function() {
          if(scope.db3Draw) {
            scope.db3Draw.destroy();
            scope.db3Draw.draw();
          }

          scope.db3Draw = scope.drawSegmentPoints_(
              {x: 0, y: 0}, 
              [scope.preload.getResult("db3"), scope.preload.getResult("db3p")],
              null,
              {x: 9, y: 7}
          );

          User.goals_points({id: scope.workspace.user.sguid}, {}, function(goalsData) {
            var needsData = {};
            var needs = JSON.parse(JSON.stringify(scope.workspace.needs));

            angular.forEach(needs, function(needItem, needKey) {
                needsData[needItem.sguid] = 0;

                angular.forEach(needItem.goals, function(goalItem, goalKey) {
                    goalItem.current_value = parseInt(goalsData[goalItem.sguid]);
                    if(goalsData[goalItem.sguid]) {
                        needsData[needItem.sguid] += parseInt(goalsData[goalItem.sguid]);
                    }
                });

                needItem.current_value = needsData[needItem.sguid];
            });

            scope.drawNeed_(scope.db3Draw, {
                corruption: 359,
                radius: 147,
                need_max: scope.findNeedBySguid("169990243011789824").points_summary,
                need_value: needsData["169990243011789824"],
                centerX: 17,
                centerY: -2,
                segment: 33,
                gradientX: 50,
                gradientY: 150,
                zIndex: 1,
                segmentMax: 48.5
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 305,
                radius: 148,
                need_max: scope.findNeedBySguid("169990243011789827").points_summary,
                need_value: needsData["169990243011789827"],
                centerX: 17,
                centerY: 5.5,
                segment: 33,
                gradientX: 120,
                gradientY: 100,
                zIndex: 2,
                segmentMax: 48
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 190,
                radius: 150,
                need_max: scope.findNeedBySguid("169990243011789825").points_summary,
                need_value: needsData["169990243011789825"],
                centerX: 34,
                centerY: 5,
                segment: 41,
                gradientX: -10,
                gradientY: -110,
                zIndex: 3,
                segmentMax: 47
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 135,
                radius: 152,
                need_max: scope.findNeedBySguid("169990243011789826").points_summary,
                need_value: needsData["169990243011789826"],
                centerX: 32,
                centerY: 4.5,
                segment: 40,
                gradientX: -100,
                gradientY: -100,
                zIndex: 4,
                segmentMax: 46.5
             });

            
          });
      }

      scope.findNeedBySguid = function(sguid) {
        return scope.workspace.needs.filter(function(value) {
          if(value.sguid == sguid)  {
            return value;
          }
        })[0];
      }

      scope.drawDashboard_ = function() {
            var manifest = [
                {src:"db2.png", id:"db2"},
                {src:"db3.png", id:"db3"},
                {src:"db-t.png", id:"dbt"},
                {src:"db1.png", id:"db"}
            ];

            scope.preload = new createjs.LoadQueue(true, "/images/");

            scope.preload.on("complete", function(event) {
                scope.drawCenter_(scope.preload.getResult("db"));
                
                scope.drawText_(scope.preload.getResult("dbt"));
                scope.drawCenterArc_();
                if(scope.workspace.needs) {
                  scope.setNeeds();  
                }
            });

            scope.preload.loadManifest(manifest);
      }

      scope.elements = {};

      scope.drawFullDashboard_ = function() {
        scope.dashboard = new Kinetic.Stage({
          container: 'mydash_draw',
          width: 400,
          height: 300
        });
        scope.drawDashboard_(); 
      }

      $(document).ready(function() {
        if(!scope.dashboard) {
          scope.drawFullDashboard_(); 
        }
      });

      scope.$watch("workspace.user.points", function (newValue) {
        scope.updatePointText_();
        scope.drawCenterArc_();

        scope.setNeeds();
      });
    }
  }
})

pgrModule.directive('equal', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            scope.$watch(attrs.equal, function (newValue) {
                if (ctrl && ctrl.$modelValue) {
                    if (newValue === ctrl.$modelValue) {
                        ctrl.$setValidity('equal', true);
                        // return newValue;
                    } else {
                        ctrl.$setValidity('equal', false);
                        // return undefined;
                    }
                }
            });
            
            ctrl.$parsers.unshift(function(viewValue) {
                if (viewValue) {
                    if (viewValue === scope.$eval(attrs.equal)) {
                        ctrl.$setValidity('equal', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('equal', false);
                        return undefined;
                    }
                } else {
                    ctrl.$setValidity('equal', true);
                    return viewValue;
                }
            });
        }
    };
});
