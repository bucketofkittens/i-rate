var host = "http://dev.sir.improva.com/api/v1";
//var host = "http://192.168.1.171:3000/api/v1"; 
var hostShort = host.replace("/api/v1", "");

var PanelsConst = {
    RIGHT: "user2",
    LEFT: "user1"
}

/**
 * Модель пользователя
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('User', function ($resource) {
    return $resource(
        host+'/users/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            updateUser: {method: 'PUT'},
            'query': {
            	method: 'GET', 
            	transformResponse: function (data) {
                    if(data) {
                        // подготавливаем данные 
                        var user = angular.fromJson(data)[0];
                        user.points = parseInt(user.points);

                        if(user.points == null || isNaN(user.points)) {
                            user.points = 0;
                        }

                        /**
                         * Указваем формат дня рождения
                         */
                        if(user.birthday) {
                            user.birthday = moment(user.birthday).format("DD.MM.YYYY");
                        }

                        return user;    
                    }
            	}
            },
            'get_short': {
                method: 'GET',
                url: host+"/users/:id/light",
                cache: true
            },
            'get_from_to_points': {
                method: 'GET',
                url: host+"/users/by_points/from/:from/to/:to",
                isArray: true
            },
            'get_all': {
                method: 'GET',
                isArray: true
            },
            'only_published': {
                method: 'GET',
                isArray: true,
                url: host+"/users/only/published"
            },
            'for_main': {
                method: 'GET',
                isArray: true,
                url: host+"/users/for/main/"
            },
            'for_main_from_limit': {
                method: 'GET',
                isArray: true,
                cache : true,
                url: host+"/users/for/main/:skip/skip/:limit/limit"
            },
            'get_names': {
                method: 'GET',
                url: host+"/users_names/"
            },
            'test_email': {
                method: 'POST',
                url: host+"/users/check_email/"
            },
            "by_league": {
                method: 'GET',
                isArray: true,
                url: host+"/users/by_league/:league_guid"
            },
            "by_league_and_limit": {
                method: 'GET',
                isArray: true,
                url: host+"/users/by_league/:league_guid/skip/:skip/limit/:limit"
            },
            "update_legue": {
                url: host+"/users/:id/league",
                method: "POST"
            },
            "needs_points": {
                method: 'GET',
                url: host+"/users/:id/needs_points"
            },
            "goals_points": {
                method: 'GET',
                url: host+"/users/:id/goals_points"
            },
            "get_friends": {
                method: 'GET',
                url: host+"/users/:id/friends",
                isArray: true
            },
            "create_friendship": {
                method: "POST",
                url: host+"/users/:id/friends"
            },
            "destroy_friendship": {
                method: "DELETE",
                url: host+"/users/:id/friends/:friendId"
            },
            "by_state": {
                method: "GET",
                isArray: true,
                url: host+"/users/by_state/:state_guid"
            },
            "by_profession": {
                method: "GET",
                isArray: true,
                url: host+"/users/by_profession/:profession_guid"
            },
            "search": {
                method: "POST",
                isArray: true,
                url: host+'/users/search'
            }
        }
    );
});

/**
 * Модель картинов
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Picture', function ($resource) {
    return $resource(
        host+'/pictures/:id', 
        {id:'@id'}, 
        {
            create: {method: 'PUT', headers : {'Content-Type': 'multipart/form-data'}},
            updatePicture: {method: 'PUT', headers : {'Content-Type': 'application/x-www-form-urlencoded'} }
        }
    );
});

pgrModule.factory('ConfirmSignup', function ($resource) {
    return $resource(
        hostShort+'/confirm_signup/:hash', 
        {hash:'@hash'}, 
        {
            test: {
                method: "GET",
                url: hostShort+'/confirm_signup/:hash'
            }
        }
    );
});

/**
 * Модель картинов
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Comments', function ($resource) {
    return $resource(
        host+'/comments/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            get_by_user: {
                url: host + "/comments/by_owner/:owner_type/:owner_guid",
                method: 'GET',
                isArray: true
            },
            updatePicture: {method: 'PUT', headers : {'Content-Type': 'application/x-www-form-urlencoded'} }
        }
    );
});

/**
 * Модель картинов
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('ImprovaLogin', function ($resource) {
    return $resource(
        'http://dev.tutors.improva.com/sessions.json', 
        {}, 
        {
            isset: {method: 'POST'}
        }
    );
});

pgrModule.factory('Password', function ($resource) {
    return $resource(
        host+'/users/update_password', 
        {}, 
        {
            update: {method: 'POST'}
        }
    );
});


/**
 * Модель для Needs
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Needs', function ($resource) {
    return $resource(
        host+'/needs/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            query: {
                method: 'GET',
                isArray: true
            }
        }
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('NeedsByUser', function ($resource) {
    return $resource(
        host+'/needs/by_user/:id', 
        {id:'@id'}
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('GoalsByUser', function ($resource) {
    return $resource(
        host+'/goals/by_user/:id', 
        {id:'@id'}
    );
});

/**
 * Модель для Goals
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Goals', function ($resource) {
    return $resource(
        host+'/goals/:id', 
        {id:'@id'}, 
        {
            query: {
                method: 'GET',
                isArray: true
            }
        }
    );
});

/**
 * Модель профессий
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Professions', function ($resource) {
    return $resource(
        host+'/goals/:id/professions', 
        {id:'@id'}, 
        {
            create: {
                method: 'POST',
                url: host+"/professions"
            },
            del: {method: "DELETE"}
        }
    );
});

pgrModule.factory('City', function ($resource) {
    return $resource(
        host+'/cities/:id', 
        {id:'@id'}, 
        {
            create: {
                method: 'POST',
                url: host+"/cities/"
            },
            del: {method: "DELETE"}
        }
    );
});

pgrModule.factory('CityByState', function ($resource) {
    return $resource(
        host+'/cities/by_state/:id', 
        {id:'@id'}
    );
});

pgrModule.factory('Country', function ($resource) {
    return $resource(
        host+'/states/', 
        {id:'@id'}, 
        {
            create: {
                method: 'POST',
                url: host+"/cities"
            },
            del: {method: "DELETE"}
        }
    );
});

pgrModule.factory('MailHash', function ($resource) {
    return $resource(
        host+'/users/mail_reset_hash/', 
        {}, 
        {
            create: {
                method: 'POST'
            }
        }
    );
});

pgrModule.factory('ProfessionCreate', function ($resource) {
    return $resource(
        host+'/professions', 
        {},
        {
            create: {
                method: 'POST'
            },
            del: {
                url: host+'/professions/:id', 
                method: "DELETE"
            }
        }
    );
});

/**
 * Модель для штатов
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('States', function ($resource) {
    return $resource(
        host+'/states/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * Модель для списка критериев
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Criterion', function ($resource) {
    return $resource(
        host+'/criterion/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('CriterionByGoal', function ($resource) {
    return $resource(
        host+'/criterion/by_goal/:id', 
        {id:'@id'},
        {
            query: {
                method: 'GET',
                isArray: true
            },
            by_guid: {
                url: host + "/criterion/:criteria_sguid",
                method: 'GET',
                isArray: true
            }
        }
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Sessions', function ($resource) {
    return $resource(
        hostShort+'/signin/', 
        {}, 
        {
            signin: {method: 'POST',  headers : {'Content-Type': 'application/x-www-form-urlencoded'}}
        }
    );
});

pgrModule.service('CityService', function (CityByState, City) {
    this.getCityByState = function(sguid, callback) {
        CityByState.query({ id: sguid }, {}, function(data) {
            callback(data);
        });
    }
    this.remove = function(sguid, key, callback) {
        City.del({id: sguid}, {}, function(data) {
            callback(data, key);
        });
    }
    this.add = function(city, state_guid, callback) {
        City.create({}, {
            "city": city,
            "state_guid": state_guid
        }, function(data) {
            callback(data);
        });
    }
});

pgrModule.service('ProfessionsService', function (Professions, ProfessionCreate) {
    this.getProfessionsByCareer = function(sguid, callback) {
        Professions.query({ id: sguid }, {}, function(data) {
            callback(data);
        });
    }
    this.remove = function(sguid, key, callback) {
    }
    this.add = function(profession, goal_guid, callback) {
        ProfessionCreate.create({}, {
            "profession": profession,
            "goal_guid": goal_guid
        }, function(data) {
            callback(data);
        });
    }
});

/**
 * Сервис авторизации
 */
pgrModule.service('SessionsService', function (Sessions, User, TokenService) {

    // забираем пользователя из кеша
    this.signin = function(params, callback, fail, improvaData) {
        var self = this;
        Sessions.signin({}, $.param(params), function(data) {
            if(data.success) {
                TokenService.set(data.token);
                self.signinSuccess_(data.guid, callback);
            } else {
                fail(data);
            }
        });
    }
    this.signinSuccess_ = function(sguid, callback) {
        User.query({id: sguid}, function(data) {
            callback(data);
        });
    }
});

/**
 * Сервис сохранения пользователя в кеше
 */
pgrModule.service('UserService', function (User, AllUserService) {
    // название кеша
    this.cacheName = 'user';

    // время кеширования
    this.cacheTime = 1440;

    // забираем пользователя из кеша
    this.getAuthData = function() {
        return lscache.get(this.cacheName);
    }

    // передаем данные в кеш
    this.setAuthData = function(user) {
        // сохраняем данные пользователя в localStorage
        lscache.set(this.cacheName, JSON.stringify(user), this.cacheTime);
    }

    // удаляем пользователя из кеша
    this.removeAuthData = function() {
        lscache.remove(this.cacheName);
    }

    // получение списка друзей
    this.getFriends = function(sguid, callback) {
        User.get_friends({id: sguid}, callback);
    }

    // создание нового пользователя
    this.create = function(params, callback, fail) {
        User.create(
            {user: JSON.stringify(params)}
            ,function(data) {
                if(!data.success && fail) {
                    fail(data);      
                }
                if(data.success && callback) {
                    callback(data);      
                }
            }
        );
    }

    // создание обновление пользователя
    this.update = function(sguid, params, callback) {
        User.updateUser({id: sguid},  {user: JSON.stringify(params)}, function(data) {
            if(callback) {
                callback(data);    
            }
        });
    }

    // получаем данные по указанному пользователю с указанным id
    this.getById = function(id, callback) {
        User.query({id: id}, function(data) {
            callback(data);
        });
    }

    this.getUsersOnServer_ = function(callback) {
        User.get_all({}, {}, function(data) {
            console.log(data);
            callback(data);
        });
    }

    this.getAll = function(callback) {
        this.getUsersOnServer_(callback);
    }


    this.persistUsersList = function(users) {
        // отправляем данные в кеш
        lscache.set('masonry', JSON.stringify(users), this.cacheTime);
    }

    // обновляем пользователя в кеше
    this.updateUserFromCache = function(users, user) {
        var keyUser = this.isUserFromCache(users, user);
        
        if(!keyUser && user.published) {
            users.push(user);
        }
        if(keyUser && !user.published) {
            users.splice(keyUser, 1);
        }

        if(keyUser && user.published) {
            angular.forEach(users, function(value, key){
                if(value.sguid == user.sguid) {
                    value = user;
                }
            });
        }

        this.persistUsersList(users);

        return users;
    }

    // проверяем есть ли пользователь в списке
    this.isUserFromCache = function(users, user) {
        var flag = false;

        angular.forEach(users, function(value, key){
            if(value.sguid == user.sguid) {
                flag = key;
            }
        });

        return flag;
    }

    // заюираем значения для колбас
    this.getGoalsPointsById = function(id, callback) {
        User.goals_points({id: id}, {}, function(goalsData) {
            callback(goalsData);
        });
    }

    // очищаем пользователя в кеше
    this.clearAuthData = function() {
        lscache.remove(this.cacheName);
    }
});


pgrModule.service('AllUserService', function (User) {
    // название кеша
    this.cacheName = 'all_user';

    // время кеширования
    this.cacheTime = 1440;

    // забираем пользователя из кеша
    this.get = function() {
        return lscache.get(this.cacheName);
    }

    this.getUserBySguid = function(sguid, list) {
        var user = null;
        angular.forEach(list, function(value, key){
            if(value.sguid == sguid) {
                user = value;
            }
        });

        return user;
    }

    this.updateUser = function(user, list) {
        angular.forEach(list, function(value, key){
            if(value.sguid == user.sguid) {
                list[key] = user;
            }
        });

        this.set(list);

        return list;
    }

    // передаем данные в кеш
    this.set = function(users) {
        lscache.set(this.cacheName, JSON.stringify(users), this.cacheTime);
    }

    // удаляем пользователя из кеша
    this.remove = function() {
        lscache.remove(this.cacheName);
    }
});

/**
 * Сервис списка нидсов
 */
pgrModule.service('NeedsService', function (Needs) {
    // название кеша
    this.cacheName = 'needs';

    // время кеширования
    this.cacheTime = 1440;

    // забираем нидсы из кеша
    this.getList = function(callback) {
        var needs = this.listPrepare_(lscache.get(this.cacheName));
        if(!needs) {
            this.getNeedsOnServer_(callback);
        } else {
            callback(needs);
        }
    }
    // забираем список нидсов с свервера
    this.getNeedsOnServer_ = function(callback) {
        var self = this;
        Needs.query({}, {}, function(data) {
            var needs = self.listPrepare_(data);
            self.persist(needs);
            callback(needs);
        });
    }
    //Сохраняем
    this.persist = function(data) {
        lscache.set(this.cacheName, JSON.stringify(data), this.cacheTime);
    }
    // удаляем Spirituality
    this.listPrepare_ = function(data) {
        if(data) {
            var spirityalityName = "Spirituality";

            angular.forEach(data, function(value, key){
                if(value.name == spirityalityName) {
                    data.splice(key, 1);
                }
            });    
        }

        return data;
    }
    // делаем все гоалсы не активными
    this.closeAllGoals = function(needs) {
        angular.forEach(needs, function(value, key){
            angular.forEach(value.goals, function(v2, k2) {
                v2.current = false;
            });
        });

        return needs;
    }

    this.closeAllNeeds = function(needs) {
        angular.forEach(needs, function(value, key){
            value.current = false;
        });

        return needs;
    }

    this.openAllNeeds = function(needs) {
        angular.forEach(needs, function(value, key){
            value.current = true;   
        });

        return needs;
    }
});

pgrModule.service('LocationService', function ($location) {

    // забираем пользователя из кеша
    this.update = function(param, value) {
        var locations = $location.search();
        locations[param] = value;
        $location.search(locations);
    }
});

/**
 * Сервис списка карьер
 */
pgrModule.service('СareerService', function (Needs) {
    // название кеша
    this.cacheName = 'career';

    // время кеширования
    this.cacheTime = 1440;

    // id карьеры
    this.careerId = '169990243011789827';

    // id карьеры
    this.moneyId = '170689401829983233';

    // название need карьеры
    this.needItemName = 'Career';

    // название goal money
    this.moneyItemName = 'Money';

    // забираем пользователя из кеша
    this.getList = function(needs, callback) {
        var career = lscache.get(this.cacheName);
        if(!career) {
            this.getCareer_(needs, callback);
        } else {
            callback(career);
        }
    }
    this.getCareer_ = function(needs, callback) {
        var needs = JSON.parse(JSON.stringify(needs));
        var self = this;

        // получаем нужный need
        var curNeed = needs.filter(function(value) {
            if(value.sguid == self.careerId) {
                return value;
            }
        })[0];

        // получаем список карьер без money
        var careerList = curNeed.goals.filter(function(value) {
            if(value.sguid != self.moneyId) { return value }
        });

        this.persist(careerList);
        callback(careerList);
    }

    // сохранение
    this.persist = function(data) {
        lscache.set(this.cacheName, JSON.stringify(data), this.cacheTime);
    }

    // считаем баллы карьеры по формуле
    this.calculate = function(needItem) {
        var max = 0;
        var carreerMax = {};
        var moneyPoints = 0;

        angular.forEach(needItem.goals, function(goal) {
            if (goal.current_value > max && goal.name != this.moneyItemName) {
              max = goal.current_value;
              carreerMax = {goal: goal.sguid, points: goal.current_value};
            }
            if(goal.name == this.moneyItemName) {
              moneyPoints = goal.current_value;
            }
        });

        return parseInt(carreerMax.points + moneyPoints);
        needsData[needItem.sguid] = parseInt(carreerMax.points + moneyPoints);
    }

    // проверяет является ли указанный need карьерой или нет
    this.isCareer = function(needItem) {
        if(needItem.name == this.needItemName) {
            return true;
        } else {
            return false;
        }
    }
});

pgrModule.service('CountryService', function (Country) {
    // название кеша
    this.cacheName = 'country';

    // время кеширования
    this.cacheTime = 1440;

    // забираем пользователя из кеша
    this.getList = function(callback) {
        var country = lscache.get(this.cacheName);
        if(!country) {
            this.getCountryOnServer_(callback);
        } else {
            callback(country);
        }
    }
    this.getCountryOnServer_ = function(callback) {
        var self = this;
        Country.query({}, {}, function(data) {
            callback(data);
            self.persist(data);
        });
    }
    this.persist = function(data) {
        lscache.set(this.cacheName, JSON.stringify(data), this.cacheTime);
    }
});

/**
 * Сервис списка лиг
 */
pgrModule.service('LeagueService', function (Leagues) {
    // название кеша
    this.cacheName = 'league';

    // время кеширования
    this.cacheTime = 1440;

    // забираем пользователя из кеша
    this.getList = function(callback) {
        this.getLeagueOnServer_(callback);
    }
    this.getLeagueOnServer_ = function(callback) {
        var self = this;
        Leagues.query({}, {}, function(data) {
            callback(data);
            self.persist(data);
        });
    }
    this.persist = function(data) {
        lscache.set(this.cacheName, JSON.stringify(data), this.cacheTime);
    }

    this.remove = function() {
        lscache.remove(this.cacheName);
    }
});


pgrModule.service('FriendsService', function (UserService, User, $rootScope) {
    // название кеша
    this.cacheName = 'follows';

    // время кеширования
    this.cacheTime = 1440;

    // забираем пользователя из кеша
    this.getList = function() {
        return lscache.get(this.cacheName);
    }

    // проверяет является ли передаваемый пользователь другом для списка друзей.
    this.isFriend = function(user, friends) {

        if(friends) {
            var item = friends.filter(function(item) {
                if(item.user.sguid == user.sguid) { return item; }
            });
            return item.length > 0 ? true : false;
        }
        
        return false;
    }

    // добавляем чувака в друзья
    this.follow = function(friend, friends, callback) {
        var user = UserService.getAuthData();
        
        if(user) {
            User.create_friendship({id: friend.sguid}, {
                friend_guid: user.sguid
            }, function(response) {     
                if(response.success) {
                    friends.push({sguid: response.message.guid, user: friend});
                    callback(friends);
                }
            });
        } else {
            if(!friends) {
                friends = [];
            }
            friends.push({sguid: null, user: friend});
            this.persist(friends);
            callback(friends);
        }
    }

    // убираем пользователя из друзей
    this.unfollow = function(friend, friends, callback) {
        var user = UserService.getAuthData();
        
        if(user) {
            User.destroy_friendship({id: user.sguid, friendId: friend.sguid}, { }, function() {
                var frend = friends.filter(function(data) {
                    if(data.user.sguid === friend.sguid) {
                        return data;
                    }
                })[0];
                var index = friends.indexOf(frend);
                friends.splice(index, 1);
                callback(friends);
            });
        } else {
            var frend = friends.filter(function(data) {
                if(data.user.sguid === friend.sguid) {
                    return data;
                }
            })[0];

            var index = friends.indexOf(frend);
            friends.splice(index, 1);

            this.persist(friends);
            callback(friends);
        }
    }

    // передаем данные в кеш
    this.persist = function(friends) {
        lscache.set(this.cacheName, JSON.stringify(friends), this.cacheTime);
    }
});

// сервис авторизации в facebook
pgrModule.service('FacebookService', function($window) {
    this.init = function() {
        window.fbAsyncInit = function() {
            FB.init({
                appId: SocialConfig.facebook.applicationId[window.location.hostname],
                cookie: true, 
                xfbml: true,
                oauth: true
            });
        };
    },
    this.getUserData = function(callback) {
        FB.api('/me', {fields: 'name,id,location,birthday,email'}, function(response) {
            callback(response);
        });
    }
    this.login = function(success, fail) {
        FB.Event.subscribe('auth.authResponseChange', success);

        $window.FB.login(function(response) {
            if (response.session) {
                if (response.scope) {
                    if(success) {
                        success(response);
                    }
                } else {
                    if(fail) {
                        fail(response);
                    }
                }
            } else {
                if(fail) {
                    fail(response);
                }
            }
        }, {scope: SocialConfig.facebook.perms});
    },
    this.logout = function() {
        FB.logout();
    }
});

// сервис авторизации в MSLiveService
pgrModule.service('MSLiveService', function($window, SocialService) {
    this.init = function(authCallback) {
        WL.init({
            client_id: SocialConfig.live.client_id,
            redirect_uri: SocialConfig.live.redirect_uri,
            scope: "wl.signin", 
            response_type: "token"
        });

        WL.Event.subscribe("auth.login", authCallback);
    },
    this.getUserData = function(callback) {
        WL.api({
            path: "me",
            method: "GET"
        }, function(dataWL) {
            callback(dataWL);
        });
    }
    this.login = function(success, fail) {
        WL.login({
            scope: SocialConfig.live.scope
        }).then(
            function (session) {
                success(session);
            },
            function (sessionError) {
                fail(sessionError);
            }
        );
    }
});

// сервис управления токеном
pgrModule.service('TokenService', function($window, GooglePlus) {
    // название кеша
    this.cacheName = 'token';

    // время кеширования
    this.cacheTime = 1440;

    this.get = function() {
        return lscache.get(this.cacheName);
    }
    this.remove = function() {
        lscache.remove(this.cacheName);
    }
    this.set = function(token) {
        lscache.set(this.cacheName, token, this.cacheTime);
    }
});

// сервис авторизации в MSLiveService
pgrModule.service('GooglePlusService', function($window, GooglePlus) {
    this.getUserData = function(callback) {
        gapi.client.load('oauth2', 'v2', function() {
          var request = gapi.client.oauth2.userinfo.get();
          request.execute(callback);
        });
    }
    this.login = function(success, fail) {
        GooglePlus.login().then(function(data) {
            success(data);
        }, function (err) {
            fail(err);
        });
    }
});

pgrModule.service('SocialService', function($window, Social, FacebookService, TokenService, UserService) {
    // название кеша
    this.cacheName = 'social';

    // время кеширования
    this.cacheTime = 1440;

    this.mutable = function(data, socialName) {
        var newData = {};

        if(data.birth_day && data.birth_month && data.birth_year && socialName == SocialNames.MSLIVE ) {
            newData["brithday"] = brithdayArray[1]+"/"+brithdayArray[0]+"/"+brithdayArray[2];
        }

        if(data.birthday && socialName == SocialNames.FACEBOOK) {
            var brithdayArray = data.birthday.split("/");
            newData["brithday"] = brithdayArray[1]+"/"+brithdayArray[0]+"/"+brithdayArray[2];
        }

        if(data.name) {
            newData["name"] = data.name;
        }

        return newData;
        
    }

    this.login = function(email, callback, socialName, updateParams) {
        var self = this;
        Social.login({}, {email: email}, function(data) {
            if(data.success) {
                TokenService.set(data.token);
                var updateData = self.mutable(updateParams, socialName);
                if(updateData && data.was_created) {
                    UserService.update(data.guid, updateData, function() {
                        if(callback) {
                            callback(data, socialName);
                        }
                    }); 
                } else {
                    if(callback) {
                        callback(data, socialName);
                    }
                }
            }
        });
    }

    // передаем данные в кеш
    this.persist = function(socialName) {
        lscache.set(this.cacheName, socialName, this.cacheTime);
    }

    this.getCurrentSocial = function() {
        return lscache.get(this.cacheName);
    }

    // передаем данные в кеш
    this.clear = function(socialName) {
        var currentSocial = this.getCurrentSocial();

        if(currentSocial == SocialNames.FACEBOOK) {
            FacebookService.logout();
        }

        lscache.remove(this.cacheName);
    }
});

pgrModule.service('ImprovaService', function(ImprovaLogin, UserService, SessionsService) {
    this.login = function(email, password, callback, fail) {
        ImprovaLogin.isset({}, {email: email, password: password}, function(dataImprova) {
            if(!dataImprova.authorized) {
                fail(dataImprova);
            } else {
                callback(dataImprova);
            }
        });
    }

    this.createDublicate = function(improvaForm, improvaData, callback, fails) {
        UserService.create({
            "login": improvaForm.email,
            "email": improvaForm.email,
            "name": improvaForm.email,
            "password": "",
            "confirmed": "1"
        }, function(data) {
            var user = {};

            if(improvaData.name) {
                user["name"] = improvaData.name;
            }
            if(improvaData.login && !improvaData.name) {
                user["name"] = improvaData.login;
            }
            if(improvaData.birthday) {
                user["birthday"] = moment(improvaData.birthday).format("DD/MM/YYYY");
            }

            UserService.update(data.message.guid, user, function() {
                SessionsService.signin({
                    "email": improvaForm.email, 
                    "password": "",
                    "from_improva": "1"
                }, function(data) {
                    if(callback) {
                        callback(data);
                    }
                });
            });
        }, function() {
            if(fails) {
                fails();
            }
        });
    }

    this.improvaToIRateMigrate = function(form, improvaData, callback, fail) {
        var self = this;
        SessionsService.signin({
                "email": form.email, 
                "password": "",
                "from_improva": "1"
            },
            function(data) {
                if(callback) {
                    callback(data);
                }
            },
            function(data) {
                self.createDublicate(form, improvaData, callback, fail);
            }
        );
    }
});

pgrModule.service('AuthUser', function () {
});


pgrModule.factory('UserCriteriaValue', function ($resource) {
    return $resource(
        host+'/user_criterion_values/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST',  headers : {'Content-Type': 'application/x-www-form-urlencoded'}},
            del: {method: "DELETE"}
        }
    );
});

pgrModule.factory('UserCriteriaValueByUser', function ($resource) {
    return $resource(
        host+'/user_criterion_values/by_user/:id', 
        {id:'@id'}, 
        {
            "query": {
                method: 'GET',
                isArray: true
            }
            
        }
    );
});

pgrModule.factory('Leagues', function ($resource) {
    return $resource(
        host+'/leagues/:id', 
        {id:'@id'}, 
        {
            "by_position": {
                method: 'GET',
                url: host+"/leagues/by_position/:position"
            },
            del: {method: "DELETE"},
            create: {method: 'POST'},
            updateLeague: {method: 'PUT'},
            recal: {
                url: host+"/leagues/recalc_for_all",
                method: 'POST'
            }
        }
    );
});

pgrModule.factory('Social', function ($resource) {
    return $resource(
        hostShort+'/signin/oauth2', 
        {},
        {
            "login": {
                method: 'POST'
            }
            
        }
    );
});

pgrModule.factory('Recaptha', function ($resource) {
    return $resource(
        hostShort+'/verify_recaptcha', 
        {},
        {
            "verify": {
                method: 'POST'
            }
            
        }
    );
});