var host = "http://dev.sir.improva.com/api/v1";
var debugHost = "http://192.168.1.116:3000/api/v1"; 
var hostShort = host.replace("/api/v1", "");

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
                        var user = angular.fromJson(data)[0];
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

/**
 * Сервис авторизации
 */
pgrModule.service('SessionsService', function (Sessions, User) {

    // забираем пользователя из кеша
    this.signin = function(login, password, callback, fail) {
        var self = this;
        Sessions.signin({}, $.param({
            "email": login,
            "password": password
        }), function(data) {
            if(data.success) {
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
pgrModule.service('UserService', function (User) {
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
        var needs = lscache.get(this.cacheName);
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
            self.persist(data);
            callback(data);
        });
    }
    //Сохраняем
    this.persist = function(data) {
        lscache.set(this.cacheName, JSON.stringify(data), this.cacheTime);
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
        var league = lscache.get(this.cacheName);
        if(!league) {
            this.getLeagueOnServer_(callback);
        } else {
            callback(league);
        }
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

    // добавляем чувака в друзья
    this.follow = function(friend, friends, callback) {
        var user = UserService.getAuthData();
        
        if(user) {
            User.create_friendship({id: friend.sguid}, {
                friend_guid: user.sguid
            }, function(response) {     
                if(response.success) {
                    friends.push({sguid: response.message.guid, user: message.user});
                }
            });
        } else {
            friends.push({sguid: null, user: friend});
            this.persist(friends);
        }
    }

    // убираем пользователя из друзей
    this.unfollow = function(friend, friends, callback) {
        var user = UserService.getAuthData();
        
        if(user) {
            User.destroy_friendship({id: user.sguid, friendId: friend.sguid}, { }, function() {
                var frend = friends.filter(function(data) {
                    if(data.user.sguid === message.frendId) {
                        return data;
                    }
                })[0];
                var index = friends.indexOf(frend);
                friends.splice(index, 1);
            });
        } else {
            var frend = friends.filter(function(data) {
                if(data.user.sguid === message.frendId) {
                    return data;
                }
            })[0];

            var index = friends.indexOf(frend);
            friends.splice(index, 1);

            this.persist(friends);
        }
    }

    // передаем данные в кеш
    this.persist = function(friends) {
        lscache.set(this.cacheName, JSON.stringify(friends), this.cacheTime);
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

