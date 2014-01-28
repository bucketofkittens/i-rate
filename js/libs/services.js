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
 * Сервис сохранения пользователя в кеше
 */
pgrModule.service('UserService', function () {
    // забираем пользователя из кеша
    this.getAuthData = function() {
        return lscache.get("user");
    }

    // передаем данные в кеш
    this.setAuthData = function(user) {
        // время жизни 
        var timeLive = 1400;

        // сохраняем данные пользователя в localStorage
        lscache.set('user', JSON.stringify(user), timeLive);
    }

    // удаляем пользователя из кеша
    this.removeAuthData = function() {
        lscache.remove('user');
    }
});

/**
 * Сервис списка needs
 */
pgrModule.service('NeedsService', function (Needs) {
    // забираем пользователя из кеша
    this.getList = function(callback) {
        var needs = lscache.get("needs");
        if(!needs) {
            this.getNeedsOnServer_(callback);
        } else {
            callback(needs);
        }
    }
    this.getNeedsOnServer_ = function(callback) {
        var self = this;
        Needs.query({}, {}, function(data) {
            self.persist(data);
            callback(data);
        });
    }
    this.persist = function(data) {
        var cacheTime = 1440;
        lscache.set('needs', JSON.stringify(data), cacheTime);
    }
});

/**
 * Сервис списка needs
 */
pgrModule.service('СareerService', function (Needs) {
    // забираем пользователя из кеша
    this.getList = function(needs, callback) {
        var career = lscache.get("career");
        if(!career) {
            this.getCareer_(needs, callback);
        } else {
            callback(career);
        }
    }
    this.getCareer_ = function(needs, callback) {
        var needs = JSON.parse(JSON.stringify(needs));

        var curNeed = needs.filter(function(value) {
            if(value.sguid == "169990243011789827") {
                return value;
            }
        })[0];

        var careerList = curNeed.goals.filter(function(value) {
            if(value.sguid != "170689401829983233") { return value }
        });

        this.persist(careerList);
        callback(careerList);
    }
    this.persist = function(data) {
        var cacheTime = 1440;
        lscache.set('career', JSON.stringify(data), cacheTime);
    }
});

pgrModule.service('CountryService', function (Country) {
    // забираем пользователя из кеша
    this.getList = function(callback) {
        var country = lscache.get("country");
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
        var cacheTime = 1440;
        lscache.set('country', JSON.stringify(data), cacheTime);
    }
});

pgrModule.service('LeagueService', function (Leagues) {
    // забираем пользователя из кеша
    this.getList = function(callback) {
        var league = lscache.get("league");
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
        var cacheTime = 1440;
        lscache.set('league', JSON.stringify(data), cacheTime);
    }
});


pgrModule.service('FriendsService', function (UserService, User, $rootScope) {
    // забираем пользователя из кеша
    this.getList = function() {
        return lscache.get("follows");
    }

    this.persist = function(friends) {
        localStorage.setItem('follows', JSON.stringify(friends));
    }

    this.follow = function(friend) {
        var user = UserService.getAuthData();
        
        if(user) {
            User.create_friendship({id: friend.sguid}, {
                friend_guid: user.sguid
            }, function(response) {     
                if(response.success) {
                    $scope.workspace.user.frends.push({sguid: response.message.guid, user: message.user});
                    $rootScope.$broadcast('followCallback', {frendId: message.friendId});
                }
            });
        } else {
            $scope.workspace.user.frends.push({sguid: null, user: friend});
            $rootScope.$broadcast('followCallback', {frendId: friend.sguid});

            this.persist();
        }
    }

    this.unfollow = function(friend) {
        var user = UserService.getAuthData();
        
        if(user) {
            User.destroy_friendship({id: user.sguid, friendId: friend.sguid}, { }, function() {
                var frend = $scope.workspace.friends.filter(function(data) {
                    if(data.user.sguid === message.frendId) {
                        return data;
                    }
                })[0];
                var index = $scope.workspace.friends.indexOf(frend);
                $scope.workspace.friends.splice(index, 1);

                $rootScope.$broadcast('unfollowCallback', {frendId: friend.sguid});
            });
        } else {
            var frend = $scope.workspace.friends.filter(function(data) {
                if(data.user.sguid === message.frendId) {
                    return data;
                }
            })[0];

            var index = $scope.workspace.friends.indexOf(frend);
            $scope.workspace.friends.splice(index, 1);

            $rootScope.$broadcast('unfollowCallback', {frendId: message.frendId});

            this.persist();
        }
    }

    // передаем данные в кеш
    this.setAuthData = function(user) {
        // время жизни 
        var timeLive = 1400;

        // сохраняем данные пользователя в localStorage
        lscache.set('user', JSON.stringify(user), timeLive);
    }

    // удаляем пользователя из кеша
    this.removeAuthData = function() {
        lscache.remove('user');
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

