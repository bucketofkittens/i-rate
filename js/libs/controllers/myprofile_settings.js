// контроллер вкладки настроки своего профиля
function MyProfileSettingsController($scope, UserService, SocialService, FriendsService, TokenService, $rootScope, $location, SocialService, CityService, ProfessionsService, $timeout, AllUserService) {
	// список городов
	$scope.city = [];

    // спиосок карьер
    $scope.careers = [];

	// спиосок профессий
	$scope.profession = [];

	// показывать или нет список городов
	$scope.showCityList = false;

	// показывать или нет список профессий
	$scope.showProfessionList = false;

	// показывать или нет кнопку добавления города
	$scope.showCityAddButton = false;

	// показывать или нет кнопку добавления профессии
	$scope.showProfessionAddButton = false;

    $scope.showUsersList = false;

    $scope.$watch('workspace.user.birthday', function (newVal, oldVal, scope) {
        if($scope.workspace.user.birthday && newVal != oldVal) {
            $scope.updateUserParamByValue('birthday', moment($scope.workspace.user.birthday).format("DD/MM/YYYY"));    
        }
    });

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
		$scope.workspace.friends = FriendsService.getList();

		// скрываем окошко профиля
		$rootScope.$broadcast('closeProfile');

		// скрываем подложную тенюшку
		$rootScope.$broadcast('hideShadow');
	}

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

        this.updateUserParamByValue('name', $scope.workspace.user.name)
    }

    // изменение состояния публикации профигя
    $scope.changePublish = function() {
        $scope.workspace.user.published = !$scope.workspace.user.published;

        // сохраняем
        $scope.updateUserParamByValue('published', $scope.workspace.user.published);
    }

	// открываем модальное окно манипуляций с картинками
	$scope.onReadFile = function($event) {
        $rootScope.$broadcast('cropImage');
    }

    // переход на страницу смены пароля
    $scope.onChangePassword = function() {
        $location.search({ change_password: true });
    }

    // забираем список городов для выбранной страны
    $scope.cityByState = function($event) {

    	$scope.workspace.user.city = {};

    	// забираем список
    	CityService.getCityByState($scope.workspace.user.state.sguid, $scope.cityByStateCallback_);

    	// сохраняем
    	$scope.updateUserParamByValue('state', $scope.workspace.user.state.sguid);
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

    // callback забора списка профессий по выбранной карьере
    $scope.getProfessionsByCareerCallback_ = function(data) {
    	$scope.profession = data;
    }

    // обновление даты рождения
    $scope.updateBirthday = function() {
        $timeout(function() {
            // подготовка даты в нужном формате
            if(moment($scope.workspace.user.birthday)) {
                var newBirthday = moment($scope.workspace.user.birthday).format("DD/MM/YYYY");

                // сохраняем
                $scope.updateUserParamByValue('birthday', newBirthday);    
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
        
        // сохраняем
        $scope.updateUserParamByValue("city", $scope.workspace.user.city.sguid);

        $scope.showCityList = false;
    }

    $scope.selectProfession = function($event, item, key) {
    	$scope.workspace.user.profession = {
        	sguid: item.sguid,
        	name: item.name,
        	goal_sguid: $scope.workspace.user.profession.goal_sguid
        };
        
        // сохраняем
        $scope.updateUserParamByValue("profession", $scope.workspace.user.profession.sguid);

        $scope.showProfessionList = false;
    }

    $scope.selectUser = function($event, item, key) {
        $scope.workspace.user.name = item.name;

        // сохраняем
        $scope.updateUserParamByValue("name", $scope.workspace.user.name);

        $scope.showUsersList = false;
    }

    // событие выбора карьеры
    $scope.selectCareer = function($event) {
    	ProfessionsService.getProfessionsByCareer(
    		$scope.workspace.user.profession.goal_sguid, 
    		$scope.getProfessionsByCareerCallback_
    	);

    	$scope.workspace.user.profession.sguid = "";
    	$scope.workspace.user.profession.name = "";

    	// сохраняем
        $scope.updateUserParamByValue("profession.goal_sguid", $scope.workspace.user.profession.goal_sguid);

        $scope.showProfessionList = false;
        $scope.showProfessionAddButton = false;
    }

    $scope.$on('quckUpdateUser', function(event, message) {
        ProfessionsService.getProfessionsByCareer(
            $scope.workspace.user.profession.goal_sguid, 
            $scope.getProfessionsByCareerCallback_
        );
    });

    // событие после обновления пользьвательских данных на сервере
    $scope.updateUserCallback_ = function(data) {
    	if(data.success) {
            UserService.setAuthData($scope.workspace.user);

            // скрываем поиск
            $rootScope.$broadcast('closeSearch');
        }
    }

    // обновление одного параметра пользователя
    $scope.updateUserParamByValue = function(name, value) {
    	var user = {};
    	var nameArray = name.split(".");

    	if(nameArray.length == 1) {
            if(value == true) {
                value = 1;
            }
            if(value == false) {
                value = 0;
            }
    		user[name] = value;
    	} else {
    		if(!user[nameArray[0]]) {
    			user[nameArray[0]] = {};
    		}
    		user[nameArray[0]][nameArray[1]] = value;
    	}
    	
    	UserService.update($scope.workspace.user.sguid, user, $scope.updateUserCallback_);
    }

    // событие изменения города в поле ввода. 
    $scope.changeCity = function($event) {
    	var countView = 0;

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
            $scope.showCityAddButton = countView == 0 ? true : false;
        } else {
        	$scope.showCityList = false;
        	$scope.showCityAddButton = false;
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

    	if($scope.workspace.user.profession.name.length > 0) {
            angular.forEach($scope.profession, function(value, key) {
                var reg = new RegExp($scope.workspace.user.profession.name, "i");
                if(reg.test(value.name)) {
                	value.show = true;
                	countView += 1;
                } else {
                	value.show = false;
                }
            });
            $scope.showProfessionList = countView == 0 ? false : true;
            $scope.showProfessionAddButton = countView == 0 ? true : false;
        } else {
        	$scope.showProfessionList = false;
        	$scope.showProfessionAddButton = false;
        }
    }

    // добавляем новую профессию
    $scope.addProfession = function($event) {
    	ProfessionsService.add(
    		{ 
                name: $scope.workspace.user.profession.name,
            },
            $scope.workspace.user.profession.goal_sguid,
            $scope.addProfessionCallback_ 
    	);
    }

    // callback добавления новой профессии
    $scope.addProfessionCallback_ = function(data) {
    	// подготавливаем массив данных по профессии
        $scope.workspace.user.profession = {
        	sguid: data.message.guid,
        	name: data.message.name,
        	goal_sguid: $scope.workspace.user.profession.goal_sguid
        };
        
        // сохраняем
        $scope.updateUserParamByValue("profession", $scope.workspace.user.profession.sguid);

        $scope.showProfessionList = false;
        $scope.showProfessionAddButton = false;

        $scope.profession.push({
        	sguid: data.message.guid,
        	name: data.message.name,
        	goal_sguid: $scope.workspace.user.profession.goal_sguid
        });
    }

    // callback добавление нового города
    $scope.addCityCallback_ = function(data) {
    	// подготавливаем массив данных по городу
        $scope.workspace.user.city = {
        	sguid: data.message.guid,
        	name: data.message.name
        };
        
        // сохраняем
        $scope.updateUserParamByValue("city", $scope.workspace.user.city.sguid);

        $scope.showCityList = false;
        $scope.showCityAddButton = false;

        $scope.city.push({
        	sguid: data.message.guid,
        	name: data.message.name
        });
    }

    // добавление нового города
    $scope.addCity = function($event) {
    	CityService.add(
    		{
    			name: $scope.workspace.user.city.name
    		}, 
    		$scope.workspace.user.state.sguid,
    		$scope.addCityCallback_
    	);
    }

    // определяем заходили ли мы через социальную сеть
    $scope.social = SocialService.getCurrentSocial();

    // показываем список городов
    if($scope.workspace.user.state) {
    	CityService.getCityByState($scope.workspace.user.state.sguid, $scope.cityByStateCallback_);
    }

    // показываем список профессий
    if($scope.workspace.user.profession) {
    	ProfessionsService.getProfessionsByCareer(
    		$scope.workspace.user.profession.goal_sguid, 
    		$scope.getProfessionsByCareerCallback_
    	);
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