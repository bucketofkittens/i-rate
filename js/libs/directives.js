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


pgrModule.directive('positionGoal', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("goalItem.current_value", function (newVal, oldVal, scope) {
        if(scope.goalItem.current_value) {
          $(element).width(scope.goalItem.current_value / (scope.goalItem.points_summary )*100+"%");
        }
      });
    }
  }
});

pgrModule.directive('positionNeed', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("needItem.current_value", function (newVal, oldVal, scope) {
        if(scope.needItem.current_value) {
          $(element).width(scope.needItem.current_value / (scope.needItem.points_summary )*100+"%");
        }
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
        if(data && data.length > 0 && attrs.route == usersName.USER2) {
          var values = JSON.parse(data);
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
            element.removeClass(classes.DOWN).removeClass(classes.UP).removeClass(classes.CENTER);
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
      var footerSize = 60;
      $(element).height($(window).height()-$(element).offset().top-footerSize);
      $(window).resize(function() {
        $(element).height($(window).height()-$(element).offset().top-footerSize);
      });
    }
  }
})

pgrModule.directive('bridge', function($window) {
  return {
    link: function(scope, element, attrs) {
      setInterval(function() {
        var currentItem = $("#content .tab .mypro.acrd .crits ul li h5.current");

        if(currentItem.size() > 0) {
          $(element).show();
          $(element).css("top",$(currentItem).offset().top-71);
          $(element).css("height",58);
          $(element).css("left", 260);
          if($(currentItem).offset().top < 120) {
            $(element).hide();
          } else {
            $(element).show();
          }
        } else {
          $(element).hide();
        }
      }, 10);
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

/**
 * Директива плитки на главной
 */
pgrModule.directive('masonry', function(User, $rootScope) {
  return {
    link: function($scope, element, attrs) {
      var parentElement = element.parent()[0];

      // добавляем скроллинг мышкой
      $(parentElement).on("mousewheel DOMMouseScroll", function($event) {
        parentElement.scrollLeft -= $event.originalEvent.wheelDeltaY ? $event.originalEvent.wheelDeltaY : $event.originalEvent.detail * 5;
      });

      /** коэффициэнт количество элементов **/
      var limitCorruption = 30;
      
      /** Количество элементов на странице **/
      var limit = parseInt($(window).height()/limitCorruption);
      
      /** текущий отступ  элементов **/
      var skip = 0;
      
      /** сколько сейчас показано элементов **/
      var view_count = 0;
      
      /** общее количество элементов **/
      var total_count = null;
      
      /** есть ли элементы в кеше **/
      var isCached = true;

      // время жизни кеша с пользователям
      var cacheTime = 1440;
      
      /** забираем список пользователей из кеша **/
      $rootScope.users = lscache.get("masonry");

      /** открываем всплывающее окно пользователя **/
      $scope.openUserInfo = function(userItem, $event) {
        $rootScope.$broadcast('showUserProfile', { user: userItem });
      }
      
      /** инициализируем isotope **/
      this.initIso = function() {
        $(element).isotope({
          itemSelector: '.iso-item',
          rowHeight: 70,
          layoutMode: "perfectMasonry",
          perfectMasonry: {
              layout: 'horizontal',
              columnWidth: 70,
              rowHeight: 70
         }
        });
      }

      /** забираем список пользователей из backend-а **/
      this.getUsersFromBackend = function(limit, skip, total_count, view_count) {
        User.for_main_from_limit({limit: limit, skip: skip}, {}, function(data) {
            $rootScope.users = $rootScope.users.concat(data);

            view_count += limit;

            // выглядит дико, знаю
            total_count = $scope.users[0] ? $scope.users[0].total_count : total_count;

            if(view_count < total_count) {
              skip += limit;
              // рекурсивно берем еще пользователей
              this.getUsersFromBackend(limit, skip, total_count, view_count);
            } else {
              // отправляем данные в кеш
              lscache.set('masonry', JSON.stringify($scope.users), cacheTime);
            }
        });
      }

      /**
       * Забираем список пользователей
       */
      if(!$scope.users) {
        isCached = false;
        $scope.users = [];
        this.getUsersFromBackend(limit, skip, total_count, view_count);  
      }
      
      // инициизируем masonry
      this.initIso();
    }
  }
})

/** 
 * Директира для внутреннего элемента masonry
 */
pgrModule.directive('masonryItem', function() {
  return {
    link: function(scope, element, attrs) {
      /** родительский элемент **/
      var parentElement = $(element).parent();
      setTimeout(function() {
        $(element).addClass("iso-item");
        parentElement.isotope("insert", $(element));
      }, randomRange(1000, 3000));
      setTimeout(function() {
        $(element).addClass("all");
      }, 5000); 
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
        if(scope.workspace.user && scope.workspace.user.points) {
          scope.centerTextDraw.setText(scope.workspace.user.points);
          scope.centerTextDraw.offsetY("-"+(scope.dashboard_size.height/2-30));
          scope.centerTextDraw.offsetX(scope.centerTextDraw.width()/2);

          scope.centerTextDraw.getLayer().draw();  
        }
      }

      scope.$watch("workspace.user.points", function (newVal, oldVal, scope) {
        if(newVal && newVal > 0) {
          if(scope.centerTextDraw) {
            scope.updatePointText_();
          } else {
            scope.drawFullDashboard_();
          }
          
          scope.drawCenterArc_(scope.db2Draw);

          if(scope.workspace.user && scope.workspace.needs && scope.workspace.needs.length > 0) {
            scope.setNeeds();
          }
        }
      });

      scope.drawSegmentPoints_ = function(positions, images, specialPosition, dotCorruptions) {
          var containerParams = {
            x: specialPosition ? specialPosition.x : scope.dashboard_size.width/2-images[0].width/2,
            y: specialPosition ? specialPosition.y : scope.dashboard_size.height/2-images[0].height/2,
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

          container.add(centerImgContainer);
          container.add(centerImgDotContainer);

          centerImgContainer.setZIndex(0);
          centerImgDotContainer.setZIndex(3);

          scope.dashboard.add(container);

          return container;
      } 

      scope.drawText_ = function(image) {
          var containerParams = {
            x: scope.dashboard_size.width/2-image.width/2,
            y: scope.dashboard_size.height/2-image.height/2,
            width: image.width,
            height: image.height
          };
          var container = new Kinetic.Layer(containerParams);

          var centerImgContainer =  new Kinetic.Image({
              image: image,
              x: 3,
              y: -30,
              name: "image4"
          });

          container.add(centerImgContainer);
          scope.dashboard.add(container);
      } 

      scope.drawCenterArc_ = function(container) {
        if(scope.workspace.user && scope.workspace.user.points && container) {
          var corruption = 90;
          var oneStep = 100000/360;
          var newAngle = degToRad(scope.workspace.user.points/oneStep+corruption);
          var baseAngle = degToRad(corruption);

          var centerRX = scope.dashboard.getWidth()/2-316;
          var centerRY = scope.dashboard.getHeight()/2-167;
          var endX = centerRX + Math.cos(newAngle) * 149;
          var endY = centerRY + Math.sin(newAngle) * 149;

          var arc = new Kinetic.Shape({
              drawFunc: function(context) {
                var ctx = context.canvas.getContext()._context;
                var x = centerRX;
                var y = centerRY;
                var radius = 149;
                var startAngle = baseAngle;
                var endAngle = newAngle;

                var gradient = context.createLinearGradient(
                  endX, 
                  endY,
                  scope.dashboard.getWidth()/2-316,
                  scope.dashboard.getHeight()/2-167
                );
                gradient.addColorStop(0, '#3e445c');
                gradient.addColorStop(1, '#c1d3ea');

                ctx.beginPath();
                ctx.arc(x, y, radius, startAngle, endAngle, false);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 61;
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * 149, centerRY + Math.sin(newAngle-0.02) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * 149,centerRY + Math.sin(newAngle+0.1) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle) * 180,centerRY + Math.sin(newAngle) * 180);
                ctx.fillStyle = gradient;
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * 149, centerRY + Math.sin(newAngle-0.02) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * 149,centerRY + Math.sin(newAngle+0.1) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle) * 120,centerRY + Math.sin(newAngle) * 120);
                ctx.fillStyle = gradient;
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            },
          });

          container.add(arc);
          arc.setZIndex(1);
          container.draw();
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
                var gradient = context.createLinearGradient(
                  centerRX + Math.cos(newAngle) * radius-params.gradientX, 
                  centerRY + Math.sin(newAngle) * radius-params.gradientY,
                  endX,
                  endY
                );

                gradient.addColorStop(0, '#c1d3ea');
                gradient.addColorStop(1, '#3e445c');

                ctx.beginPath();
                ctx.rotate(degToRad(-1.5));
                ctx.arc(x, y, radius, startAngle, endAngle, false);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 61;
                ctx.stroke();
                ctx.closePath();

                if(params.need_max - params.need_value > 500) {
                  ctx.beginPath();
                  ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * radius, centerRY + Math.sin(newAngle-0.02) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * radius,centerRY + Math.sin(newAngle+0.1) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle) * (radius+30),centerRY + Math.sin(newAngle) * (radius+30));
                  ctx.fillStyle = gradient;
                  ctx.strokeStyle = gradient;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  ctx.fill();
                  ctx.closePath();
                  ctx.beginPath();
                  ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * radius, centerRY + Math.sin(newAngle-0.02) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * radius,centerRY + Math.sin(newAngle+0.1) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle) * (radius-30),centerRY + Math.sin(newAngle) * (radius-30));
                  ctx.fillStyle = gradient;
                  ctx.strokeStyle = gradient;
                  ctx.lineWidth = 2;
                  ctx.stroke();
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
          var container = new Kinetic.Layer();

          var centerImgContainer = new Kinetic.Image({
              image: image,
              x: scope.dashboard_size.width/2-image.width/2,
              y: scope.dashboard_size.height/2-image.height/2,
              name: "image"
          });
          
          var centerText = new Kinetic.Text({
            text: '',
            fontSize: 25,
            fontFamily: 'Helvetica Neue Light',
            fill: '#000000',
            x: scope.dashboard_size.width/2
          });

          container.add(centerImgContainer);
          container.add(centerText);

          scope.dashboard.add(container);

          scope.centerTextDraw = centerText;
          scope.pointsLayer = container;

          scope.updatePointText_();
      }

      scope.$watch("workspace.needs", function (newVal, oldVal, scope) {
        if(newVal && newVal.length > 0 && scope.workspace.user && scope.workspace.user.sguid) {
          scope.setNeeds();
        }
      });

      scope.$watch("workspace.user", function (newVal, oldVal, scope) {
        if(newVal && newVal.sguid > 0 && scope.workspace.needs && scope.workspace.needs.length > 0) {
          scope.setNeeds();
        }
      });

      scope.setNeeds = function() {
          if(scope.db3Draw) {
            scope.clearNeeds();
            scope.db3Draw.draw();  
          }

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
                
                if(needItem.name == "Career") {
                    var max = 0;
                    var carreerMax = {};
                    var moneyPoints = 0;
                    var moneyMax = 0;

                    angular.forEach(needItem.goals, function(goal) {
                        if (goal.current_value > max && goal.name != "Money") {
                          max = goal.current_value;
                          carreerMax = {goal: goal.sguid, points: goal.current_value, max: goal.points_summary};
                        }
                        if(goal.name == "Money") {
                          moneyPoints = goal.current_value;
                          moneyMax = goal.points_summary;
                        }

                    });

                    scope.carreeMax = parseInt(carreerMax.max + moneyMax);
                    needsData[needItem.sguid] = parseInt(carreerMax.points + moneyPoints);
                }

                needItem.current_value = needsData[needItem.sguid];
            });

            scope.drawNeed_(scope.db3Draw, {
                corruption: 358,
                radius: 253,
                need_max: scope.findNeedBySguid("169990243011789824").points_summary,
                need_value: needsData["169990243011789824"],
                centerX: 205,
                centerY: 97,
                segment: 33,
                gradientX: 50,
                gradientY: 150,
                zIndex: 1,
                segmentMax: 46
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 303,
                radius: 260,
                need_max: scope.carreeMax,
                need_value: needsData["169990243011789827"],
                centerX: 210,
                centerY: 92,
                segment: 33,
                gradientX: 120,
                gradientY: 100,
                zIndex: 2,
                segmentMax: 45
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 190,
                radius: 245,
                need_max: scope.findNeedBySguid("169990243011789825").points_summary,
                need_value: needsData["169990243011789825"],
                centerX: 228,
                centerY: 102,
                segment: 41,
                gradientX: -10,
                gradientY: -110,
                zIndex: 3,
                segmentMax: 48
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 134.5,
                radius: 245,
                need_max: scope.findNeedBySguid("169990243011789826").points_summary,
                need_value: needsData["169990243011789826"],
                centerX: 227,
                centerY: 100,
                segment: 40,
                gradientX: -100,
                gradientY: -100,
                zIndex: 4,
                segmentMax: 48
             });
          });
      }

      scope.clearNeeds = function() {
        angular.forEach(scope.needsLine, function(value, key){
          value.remove();
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
                {src:"db22.png", id:"db2"},
                {src:"db22p.png", id:"db2p"},
                {src:"db3.png", id:"db3"},
                {src:"db3p.png", id:"db3p"},
                {src:"db-t.png", id:"dbt"},
                {src:"db1.png", id:"db"}
            ];

            var preload = new createjs.LoadQueue(true, "/images/");
            preload.on("complete", function(event) {
                scope.drawCenter_(preload.getResult("db"));

                var cont = scope.drawSegmentPoints_( 
                    {x: 0, y: 0}, 
                    [preload.getResult("db2"), preload.getResult("db2p")],
                    null,
                    {x: 9, y: 7}
                );
                scope.db2Draw = cont;
                var cont2 =scope.drawSegmentPoints_(
                    {x: 0, y: 0}, 
                    [preload.getResult("db3"), preload.getResult("db3p")],
                    {x: 200, y: 100},
                    {x: 9, y: 7}
                );
                scope.db3Draw = cont2;

                scope.drawText_(preload.getResult("dbt"));
                scope.drawCenterArc_(cont);
            });

            preload.loadManifest(manifest);
      }

      scope.drawFullDashboard_ = function() {
        scope.dashboard = new Kinetic.Stage({
          container: 'mydash_draw',
          width: 1000,
          height: 700
        });
        scope.dashboard_size = { width: 1000, height: 700 };
        scope.drawDashboard_(); 
      }

      $(window).on("load", function() {
        if(!scope.dashboard) {
          scope.drawFullDashboard_();
        }
      });

      $(document).ready(function() {
        if(!scope.dashboard) {
          scope.drawFullDashboard_(); 
        }
      });
    }
  }
})
