// контроллер вкладки настроки своего профиля
function MyProfileSettingsController($scope, UserService, SocialService, FriendsService, TokenService, $rootScope, $location, SocialService, CityService, ProfessionsService, $timeout, AllUserService, СareerService, ProfessionService) {
    // список городов
    $scope.city = [];

    // показывать или нет список городов
    $scope.showCityList = false;

    // показывать или нет список профессий
    $scope.showProfessionList = false;

    $scope.showUsersList = false;

    $scope.isChanged = false;

    $scope.isChange = false;

    $scope.addCount = 0;

    $scope.addMaxCount = 0;

    // выходим из пользователя
    $scope.onLogout = function() {
        // убиваем токен
        TokenService.remove();

        // убираем данные о пользователе из кеша
        UserService.clearAuthData();

        UserService.clearAdmin();

        // убираем зписить из кеша о социалках
        SocialService.clear();

        // удаляем пользователя из scope
        $scope.workspace.user = null;

        // забираем список друзей для не авторизованного пользователя
        $scope.workspace.friends = {};

        // скрываем окошко профиля
        $rootScope.$broadcast('closeProfile');

        // скрываем подложную тенюшку
        $rootScope.$broadcast('hideShadow');
    };

    $scope.$on('quckUpdateUser', function(message) {
        $scope.isChanged = false;
        $scope.isChange = false;
        $scope.allAdd = false;
        $scope.addCount = 0;
        $scope.addMaxCount = 0;

        if($scope.workspace.user.state && $scope.workspace.user.state.sguid) {
            CityService.getCityByState($scope.workspace.user.state.sguid, $scope.cityByStateCallback_);    
        }
    });

    $scope.pepareUserData = function() {
        var data = {
            birthday: moment($scope.workspace.user.birthday).format("DD/MM/YYYY"),
            name: $scope.workspace.user.name
        };

        if($scope.workspace.user.birthday) {
            data.birthday = moment($scope.workspace.user.birthday).format("DD/MM/YYYY");
        }
        if($scope.workspace.user.profession) {
            data.profession = $scope.workspace.user.profession.name && $scope.workspace.user.profession.sguid  ? $scope.workspace.user.profession.sguid : "";
        }
        if($scope.workspace.user.state && $scope.workspace.user.state.sguid) {
            data.state = $scope.workspace.user.state.sguid;
        }

        if($scope.workspace.user.city) {
            data.city = $scope.workspace.user.city.name && $scope.workspace.user.city.sguid  ? $scope.workspace.user.city.sguid : "";
        }
        if($scope.workspace.user.career && $scope.workspace.user.career.sguid) {
            data.career = $scope.workspace.user.career.sguid;
        }

        return data;
    }

    $scope.$watch('workspace.user.birthday', function (newVal, oldVal, scope) {
        if(newVal && oldVal && oldVal != newVal) {
            $scope.changeData();
        }
    });

    $scope.changeData = function() {
        $scope.isChange = true;
        $scope.isChanged = false;
    }

    $scope.changeDataDisable = function() {
        $scope.isChange = false;
    }

    $scope.testIn = function(arr, item, param) {
        var ret = false;
        angular.forEach(arr, function(value, key) {
            if(value[param] == item) {
                ret = true;
            }
        });

        return ret;
    }

    $scope.onChange = function() {
        var isAdd = false;
        if($scope.workspace.user.city && $scope.workspace.user.city.name && $scope.workspace.user.city.name.length > 0) {
            if(!$scope.testIn($scope.city, $scope.workspace.user.city.name, "name")) {
                isAdd = true;
                $scope.addMaxCount += 1;

                CityService.add(
                    {
                        name: $scope.workspace.user.city.name
                    }, 
                    $scope.workspace.user.state.sguid,
                    $scope.addCityCallback_
                );
            }    
        }
        
        if($scope.workspace.user.profession && $scope.workspace.user.profession.name && $scope.workspace.user.profession.name.length > 0) {
            if(!$scope.testIn($scope.workspace.professions, $scope.workspace.user.profession.name, "name")) {
                isAdd = true;
                $scope.addMaxCount += 1;

                ProfessionsService.add(
                    { 
                        name: $scope.workspace.user.profession.name
                    },
                    $scope.workspace.user.profession.goal_sguid,
                    $scope.addProfessionCallback_ 
                );
            }
        }

        if(!isAdd) {
            $scope.updateUser();
        }
    }

    $scope.updateUser = function() {
        UserService.update($scope.workspace.user.sguid, $scope.pepareUserData(), $scope.updateUserCallback_);
    }

    // событие после обновления пользьвательских данных на сервере
    $scope.updateUserCallback_ = function(data) {
        if(data.success) {
            UserService.setAuthData($scope.workspace.user);

            // скрываем поиск
            $rootScope.$broadcast('closeSearch');

            $scope.isChanged = true;
            $scope.addCount = 0;
            $scope.addMaxCount = 0;
            $scope.changeDataDisable();
        }
    }

    $scope.updateUserPublishCallback_ = function(data) {
        if(data.success) {
            UserService.setAuthData($scope.workspace.user);

            // скрываем поиск
            $rootScope.$broadcast('closeSearch');
        }
    }

    // добавляем новую профессию
    $scope.addProfession = function($event) {
        ProfessionsService.add(
            { 
                name: $scope.workspace.user.profession.name
            },
            $scope.workspace.user.profession.goal_sguid,
            $scope.addProfessionCallback_ 
        );
    };

    // добавление нового города
    $scope.addCity = function($event) {
        CityService.add(
            {
                name: $scope.workspace.user.city.name
            }, 
            $scope.workspace.user.state.sguid,
            $scope.addCityCallback_
        );
    };

    $scope.updateName = function() {
        var countView = 0;
        if($scope.workspace.user.name.length > 0) {
            angular.forEach($scope.workspace.users, function(value, key) {
                var reg = new RegExp($scope.workspace.user.name, "i");
                if(reg.test(value.name)) {
                    value.show = true;
                    countView += 1;
                } else {
                    value.show = false;
                }
            });
            $scope.showUsersList = countView == 0 ? false : true;
        } else {
            $scope.showUsersList = false;
        }
    }

    // изменение состояния публикации профигя
    $scope.changePublish = function() {
        $scope.workspace.user.published = !$scope.workspace.user.published;

        UserService.update($scope.workspace.user.sguid, { published: $scope.workspace.user.published ? 1 : 0 }, $scope.updateUserPublishCallback_);
    }

    $("body").on("change", "#photo_crop", function() {
        var file = this.files[0];
        
        if(file) {
            $rootScope.$broadcast('cropImageRead');
            $rootScope.$broadcast('cropImage');
        } else {
            $rootScope.$broadcast('cropImageClose');
            
        }
    });

	// открываем модальное окно манипуляций с картинками
	$scope.onOpenFile = function($event) {
        
    }

    // переход на страницу смены пароля
    $scope.onChangePassword = function() {
        $location.search({ change_password: true });
    }

    $scope.fixIpad_ = function() {
        $timeout(function() {
            document.activeElement.blur();
            $("input").blur();
        }, 0);
    }

    // забираем список городов для выбранной страны
    $scope.cityByState = function($event) {
        $scope.fixIpad_();
        
    	$scope.workspace.user.city = {};
        $scope.changeData();

    	// забираем список
    	CityService.getCityByState($scope.workspace.user.state.sguid, $scope.cityByStateCallback_);
    }

    // callback для загрузки списка городов для выбранной страны
    $scope.cityByStateCallback_ = function(data, key) {
    	$scope.city = data;
    }

    // callback удаления города
    $scope.deleteCityItemCallback_ = function(data, key) {
    	$scope.city.splice(key, 1);
    }

    // событие удаления города
    $scope.deleteCityItem = function($event, item, key) {
        CityService.remove(item.sguid, key, $scope.deleteCityItemCallback_);
    }

    // callback удаления города
    $scope.deleteProfessionItemCallback_ = function(data, key) {
        $scope.workspace.professions.splice(key, 1);
    }

    // событие удаления города
    $scope.deleteProfessionItem = function($event, item, key) {
        ProfessionService.remove(item.sguid, key, $scope.deleteProfessionItemCallback_);
    }

    // обновление даты рождения
    $scope.updateBirthday = function() {
        $timeout(function() {
            // подготовка даты в нужном формате
            if(moment($scope.workspace.user.birthday)) {
                var newBirthday = moment($scope.workspace.user.birthday).format("DD/MM/YYYY");
            } 
        }, 0);
    }

    // событие выбора города из списка городов
    $scope.selectCity = function($event, item, key) {
    	// подготавливаем массив данных по городу
        $scope.workspace.user.city = {
        	sguid: item.sguid,
        	name: item.name
        };

        $scope.showCityList = false;
    }

    $scope.selectProfession = function($event, item, key) {
    	$scope.workspace.user.profession = {
        	sguid: item.sguid,
        	name: item.name
        };

        $scope.showProfessionList = false;
    }

    $scope.selectUser = function($event, item, key) {
        $scope.workspace.user.name = item.name;

        $scope.showUsersList = false;
    }

    // событие выбора карьеры
    $scope.selectCareer = function($event) {
        $scope.fixIpad_();

        $scope.changeData();
    }

    // событие изменения города в поле ввода. 
    $scope.changeCity = function($event) {
    	var countView = 0;
        
        $scope.changeData();

    	if($scope.workspace.user.city.name.length > 0) {
            angular.forEach($scope.city, function(value, key) {
                var reg = new RegExp($scope.workspace.user.city.name, "i");
                if(reg.test(value.name)) {
                	value.show = true;
                	countView += 1;
                } else {
                	value.show = false;
                }
            });
            $scope.showCityList = countView == 0 ? false : true;
        } else {
        	$scope.showCityList = false;
        }
    }

    $scope.onClose = function($event) {
        if($event.target.nodeName != "A" && $event.target.nodeName != "SPAN") {
            $scope.showCityList = false;
            $scope.showProfessionList = false;
            $scope.showUsersList = false;
        }
    }

    // событие изменения профессии в поле ввода
    $scope.changeProfession = function($event) {
    	var countView = 0;
        
        $scope.changeData();

    	if($scope.workspace.user.profession.name.length > 0) {
            angular.forEach($scope.workspace.professions, function(value, key) {
                var reg = new RegExp($scope.workspace.user.profession.name, "i");
                if(reg.test(value.name)) {
                	value.show = true;
                	countView += 1;
                } else {
                	value.show = false;
                }
            });
            $scope.showProfessionList = countView == 0 ? false : true;
        } else {
        	$scope.showProfessionList = false;
        }
    };



    // callback добавления новой профессии
    $scope.addProfessionCallback_ = function(data) {
    	// подготавливаем массив данных по профессии
        $scope.workspace.user.profession = {
        	sguid: data.message.guid,
        	name: data.message.name,
        	goal_sguid: $scope.workspace.user.profession.goal_sguid
        };

        $scope.showProfessionList = false;
        
        $rootScope.$broadcast('professionsLoad', {force: true});

        $scope.addCount += 1;

        if($scope.addCount == $scope.addMaxCount) {
            $scope.updateUser();
        }
    };

    // callback добавление нового города
    $scope.addCityCallback_ = function(data) {
    	// подготавливаем массив данных по городу
        $scope.workspace.user.city = {
        	sguid: data.message.guid,
        	name: data.message.name
        };

        $scope.showCityList = false;

        $scope.city.push({
        	sguid: data.message.guid,
        	name: data.message.name
        });

        $scope.addCount += 1;

        if($scope.addCount == $scope.addMaxCount) {
            $scope.updateUser();
        }
    };

    // определяем заходили ли мы через социальную сеть
    $scope.social = SocialService.getCurrentSocial();

    // показываем список городов
    if($scope.workspace.user.state) {
    	CityService.getCityByState($scope.workspace.user.state.sguid, $scope.cityByStateCallback_);
    }

    // загружаем список стран
    $rootScope.$broadcast('countryLoad');

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0',
        dateFormat: 'dd/mm/yy'
    };
    
    
}