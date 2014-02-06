/**
 * 
 * @param {[type]} $scope
 * @param {[type]} Goals
 * @param {[type]} Criterion
 */
function NeedsAndGoalsController($scope, СareerService, UserService, Goals, Criterion, UserCriteriaValue, $rootScope, CriterionByGoal, UserCriteriaValueByUser, $routeParams, Needs, User, $element, NeedsService) {
    // список needs-сов
    $scope.needs = [];

    // событие изенения workspace.needs
    $scope.$watch('workspace.needs', function (newVal, oldVal, scope) {
        if($scope.workspace.needs) {
            // делаем локальную копию нидсов
            $scope.needs = JSON.parse(JSON.stringify($scope.workspace.needs));

            // забираем пользовательские данные.
            $scope.loadUserData_();
        }
    });

    // когда получаем данные пользователя
    $scope.$watch('user', function (newVal, oldVal, scope) {
        $scope.loadUserData_();
    });

    // забираем пользовательские данные для колбас
    $scope.loadUserData_ = function() {
        $scope.bindUserNeedsValues();
    }

    // забрали данные колбас
    $scope.bindUserNeedsValuesCallback_ = function(goalsData) {
        // массив данных кобас
        var needsData = {};

        angular.forEach($scope.needs, function(needItem, needKey) {
            needsData[needItem.sguid] = 0;

            angular.forEach(needItem.goals, function(goalItem, goalKey) {
                goalItem.current_value = parseInt(goalsData[goalItem.sguid]);
                if(goalsData[goalItem.sguid]) {
                    needsData[needItem.sguid] += parseInt(goalsData[goalItem.sguid]);
                }
            });

            if(СareerService.isCareer(needItem))
                needsData[needItem.sguid] = СareerService.calculate(needItem);

            needItem.current_value = needsData[needItem.sguid];
        });
        $rootScope.$broadcast('needUserValueLoaded', {
            needsValues: needsData,
            userId: $scope.user.sguid,
            route: $scope.route
        });
        $rootScope.$broadcast('goalUserValueLoaded', {
            goalsValues: goalsData,
            userId: $scope.user.sguid,
            route: $scope.route
        });
    }
    
    // забираем данные колбас
    $scope.bindUserNeedsValues = function() {
        UserService.getGoalsPointsById($scope.user.sguid, $scope.bindUserNeedsValuesCallback_);;
    }

    $scope.addEmptyElement = function(goal) {
        angular.forEach(goal.criteriums, function(criteriumsItem, criteriumsKey) {
            if(criteriumsItem.criteria_values) {
                criteriumsItem.criteria_values.splice(0, 0, {
                    name: "none",
                    position: 0,
                    sguid: "none",
                    value: 0,
                }); 
            }
        });
    }

    /**
     * Забираем список критериев для goals
     */
    $scope.getCriteriumByGoal = function(goal) {
        // создаем массив критериев
        goal.criteriums = [];

        // количество загруженных критериев
        var countLoad_ = 0;

        // всего критериев
        var maxCount_ = goal.criterion_guids.length;

        angular.forEach(goal.criterion_guids, function(value, key){
            CriterionByGoal.by_guid({criteria_sguid: value}, function(data) {
                goal.criteriums.push(data[0]);
                countLoad_ += 1;

                if(countLoad_ == maxCount_) {
                    /**
                     * добавляем пустой элемент
                     */
                    $scope.addEmptyElement(goal);

                    /**
                     * забираем значения для текущего пользователя
                     */
                    $scope.getCriteriumValueByUser(goal);
                }
            });
        });
    }

    /**
     * получаем данные по колбаскам для текущего пользователя
     * @param  {[type]} goal [description]
     * @return {[type]}      [description]
     */
    $scope.getCriteriumValueByUser = function(goal) {
        UserCriteriaValueByUser.query({id: $scope.user.sguid}, {}, function(d) {

            angular.forEach(d, function(userCriteriaItem, userCriteriaKey) {
                var fCriteria = goal.criteriums.filter(function(value) {
                    return value.sguid == userCriteriaItem.criteria_sguid;
                })[0];
                
                if(fCriteria) {
                    fCriteria.user_criteria_sguid = userCriteriaItem.criteria_value_sguid;
                    fCriteria.user_criteria_id = userCriteriaItem.sguid;

                    $rootScope.$broadcast('criteriaUserValueLoaded', {
                        fCriteria: fCriteria,
                        userId: $scope.user.sguid,
                        route: $scope.route
                    });

                    var currentElement = $('li[data-id="'+fCriteria.sguid+'"] li[data-id="'+userCriteriaItem.criteria_value_sguid+'"]', $($element));
                    $scope.setCriteriaPosition(currentElement);
                }
            });
        });
    }

    $scope.$on('closeAllGoals', function($event, message) {
        $scope.needs = NeedsService.closeAllGoals($scope.needs);
    });

    $scope.$on('openCriteriumList', function($event, message) {
        $scope.getCriteriumByGoal(message.goal);
    });

    /**
     * 
     * @param  {[type]} criteria [description]
     * @return {[type]}          [description]
     */
    $scope.onCriteriaSelect = function(criteriaValue, criteria, $event, needItem, goalItem) {
        if(!$($event.target).hasClass("current")) {
            if(criteriaValue.sguid !== "none") {
                UserCriteriaValue.create({}, $.param({
                    "user_guid": $scope.workspace.user.sguid,
                    "criteria_guid": criteria.sguid,
                    "criteria_value_guid": criteriaValue.sguid
                }), function(data) {
                    criteria.user_criteria_id = data.message.sguid;
                    $rootScope.$broadcast('userCriteriaUpdate');
                });
            } else {
                if(criteria.user_criteria_id) {
                    UserCriteriaValue.del({id: criteria.user_criteria_id}, {}, function(data) {
                        $rootScope.$broadcast('userCriteriaUpdate');
                    }); 
                } else {
                    $rootScope.$broadcast('userCriteriaUpdate');
                }
            }

            var target = $event.target.tagName == "LI" ? $($event.target) : $($event.target).parent();
            $scope.setCriteriaPosition(target);
            $scope.updateNeedsAndAreaPoints(criteriaValue, criteria, needItem, goalItem, true);
        }
        
    }

    /**
     * 
     * @param  {[type]} criteria [description]
     * @return {[type]}          [description]
     */
    $scope.onPointsSet = function(currentValue, criteriaValue, needItem, goalItem) {
        if(currentValue != criteriaValue) {
            var delta = parseInt(criteriaValue) - parseInt(currentValue);
            needItem.current_value = parseInt(needItem.current_value) + parseInt(delta);
            goalItem.current_value = parseInt(goalItem.current_value) + parseInt(delta);
            if(needItem.name == "Career") {
                var max = 0;
                var carreerMax = {};
                var moneyPoints = 0;

                angular.forEach(needItem.goals, function(goal) {
                    if (goal.current_value > max && goal.name != "Money") {
                      max = goal.current_value;
                      carreerMax = {goal: goal.sguid, points: goal.current_value};
                    }
                    if(goal.name == "Money") {
                      moneyPoints = goal.current_value;
                    }
                });

                needItem.current_value = parseInt(carreerMax.points + moneyPoints);
            }

            var newPoints = 0;
            angular.forEach($scope.needs, function(value, key){
                if(value.current_value) {
                    newPoints += value.current_value;    
                }
            });

            $scope.workspace.user.points = newPoints;

            User.update_legue({id: $scope.workspace.user.sguid}, function(data) {
                $scope.workspace.user.league = data.message;
            });
        }
    }

    /**
     * 
     * @param  {[type]} criteria [description]
     * @return {[type]}          [description]
     */
    $scope.getAffects = function(depend_guids, goalItem, deps) {
        var criteriums = 1;

        angular.forEach(depend_guids, function(value, key){
            var sguid = value;

            var fsCriterium = goalItem.criteriums.filter(function (criterium) { 
                return criterium.sguid == sguid;
            })[0];

            var fsCriteriumValue = fsCriterium.criteria_values.filter(function(value) {
                if(fsCriterium.old_user_criteria_sguids && deps) {
                    return value.sguid == fsCriterium.old_user_criteria_sguids;
                } else {
                    return value.sguid == fsCriterium.user_criteria_sguid;
                }
                
            })[0];


            if(fsCriteriumValue) {
                criteriums *= fsCriteriumValue.value;
            } else {
                criteriums = 0;
            }
        });


        return criteriums;
    }

    /**
     * Обновляет данные needs и area на фронте
     * @param  {[type]} criteriaValue [description]
     * @param  {[type]} criteria      [description]
     * @param  {[type]} needItem      [description]
     * @param  {[type]} goalItem      [description]
     * @return {[type]}               [description]
     */
    $scope.updateNeedsAndAreaPoints = function(criteriaValue, criteria, needItem, goalItem, oneCall) {
        
        var fCriterium = goalItem.criteriums.filter(function (criterium) { 
            return criterium.sguid == criteria.sguid;
        });

        var currentValue = 0;
        
        if(fCriterium[0].user_criteria_sguid) {
            var fCriteriumValue = fCriterium[0].criteria_values.filter(function(value) {
                return value.sguid == fCriterium[0].user_criteria_sguid;
            }
        );

        if(criteria["depend_guids"].length == 0) {
          currentValue = fCriteriumValue[0].value;
        } else {
          var criteriums = $scope.getAffects(criteria["depend_guids"], goalItem, true);
          currentValue = fCriteriumValue[0].value*criteriums;
        }
        }

        if(!criteria["affects?"]) {
            if(criteria["depend_guids"].length == 0) {
              $scope.onPointsSet(currentValue, criteriaValue.value, needItem, goalItem);
            } else {
              var criteriums = $scope.getAffects(criteria["depend_guids"], goalItem);
              $scope.onPointsSet(currentValue, criteriaValue.value*criteriums, needItem, goalItem);
            }
        }

        if(criteria["affects?"]) {
            angular.forEach(criteria["affect_guids"], function(value, key){
              var sguid = value;

              var fsCriterium = goalItem.criteriums.filter(function (criterium) {
                return criterium.sguid == sguid;
              })[0];

              var fsCriteriumValue = fsCriterium.criteria_values.filter(function(value) {
                return value.sguid == fsCriterium.user_criteria_sguid;
              })[0];

              if(fsCriteriumValue) {
                $scope.updateNeedsAndAreaPoints(fsCriteriumValue, fsCriterium, needItem, goalItem);
              }
            });
        }

        if(fCriterium[0].user_criteria_sguid) {
            fCriterium[0].old_user_criteria_sguids = fCriterium[0].user_criteria_sguid;
        } else {
            fCriterium[0].old_user_criteria_sguids = 'none';
        }
            fCriterium[0].user_criteria_sguid = criteriaValue.sguid;

        if(oneCall) {
            $scope.updateNeedsAndAreaPoints(criteriaValue, criteria, needItem, goalItem);
        }
    }

    /**
     * перемещает текущее положение колбасок
     * @param {[type]} elm [description]
     */
    $scope.setCriteriaPosition = function(elm) {
        var parentLi  = elm,
            parentUl  = parentLi.parent(),
            slider = parentUl.parent().find("span");

        parentUl.find("li").removeClass("current");
        parentLi.addClass("current");

        if($(parentLi).size() > 0 && parentLi.index() != 0) {
            var size = parentLi.get(0).offsetLeft + parentLi.get(0).clientWidth;
            if (size <  15) {
                size = 0;
            }
            slider.css("width", size + "px");
        } else {
            slider.css("width", "10px");
        }
        
        var isCurrent = false;
        $.each(parentUl.find("li"), function(key, value) {
            if(value == parentLi.get(0)) {
                isCurrent = true;
            }

            if(!isCurrent) {
                $(value).addClass("white-text");
            } else {
                $(value).removeClass("white-text");
            }
            
        });
    }

    /**
     * выставляет колбаски на коль
     * @param {[type]} elm [description]
     */
    $scope.setCriteriaPositionNull = function(elm) {
        var parentLi  = elm.parent(),
            parentUl  = parentLi.parent(),
            slider = parentUl.parent().find("span");

        parentUl.find("li").removeClass("current").removeClass("white-text");
        parentUl.find("li:eq(0)").addClass("current");

        slider.css("width", "5%");
    }
}