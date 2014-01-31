/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 */
function RootController($scope, FacebookService, СareerService, LeagueService, CountryService, NeedsService, FriendsService, UserService, User, $rootScope, Needs, Social, $cookieStore, States, Professions, $location, $timeout, Leagues) {
    
    /**
     * Открывает модальное окно
     * @param  {[type]} nameModal название модального окна
     * @return {[type]}           [description]
     */
    $scope.showModal = function(nameModal) {
        $rootScope.$broadcast('openModal', { name: nameModal});
    }

    /**
     * Массив всяких данных
     * @type {Object}
     */
    $scope.workspace = {};

    /**
     * Забираем юзера из кеша
     * @type {[type]}
     */
    $scope.workspace.user = UserService.getAuthData();

    /**
     * Массив хренения списка друзей для не авторизованного пользователя
     * @type {[type]}
     */
    $scope.workspace.friends = $scope.workspace.user && $scope.workspace.user.friends ? $scope.workspace.user.friends : FriendsService.getList();

    this.needsServiceCallback_ = function(data) {
        $scope.workspace.needs = data;
        СareerService.getList($scope.workspace.needs, this.careerServiceCallback_);
    }

    this.careerServiceCallback_ = function(data) {
        $scope.workspace.careers = data;
    }

    this.countryServiceCallback_ = function(data) {
        $scope.workspace.country = data;
    }

    this.leagueServiceCallback_ = function(data) {
        $scope.workspace.country = data;
    }
    
    // список нидсов
    NeedsService.getList((this.needsServiceCallback_).bind(this));
    
    // список стран
    CountryService.getList(this.countryServiceCallback_);
    
    // список лиг
    LeagueService.getList(this.leagueServiceCallback_);

    /**
    $scope.$on('logout', function($event, message) {
        $scope.workspace.user = null;
    });

    $scope.onLogout = function() {
        $scope.workspace.user = null;

        // затираем кеш пользователя
        UserService.removeAuthData();
    
        if(socialsAccess.facebook.isLoggined) {
            $facebook.logout();
            socialsAccess.facebook.isLoggined = false;  
        }

        if(socialsAccess.live.isLoggined) {
            WL.logout();
            socialsAccess.live.isLoggined = false;  
        }
        
        if(socialsAccess.googlePlus.isLoggined) {
            $.get("https://mail.google.com/mail/u/0/?logout&hl=en");  
            
            socialsAccess.googlePlus.isLoggined = false;  
        }
        
        
        $rootScope.$broadcast('logout');

        $scope.workspace.friends = FriendsService.getList();
        $location.path("/");
    }

    $scope.getUserInfo = function() {
        if($scope.authUserId) {
            User.query({id: $scope.authUserId}, function(data) {
                $scope.workspace.user = data;

                // получаем список друзей
                User.get_friends({id: $scope.workspace.user.sguid}, {}, function(friends) {
                   $scope.workspace.friends = friends;
                   $rootScope.$broadcast('authUserGetData');
                });
            });
        }
    };

    $scope.$on('onSignin', function($event, message) {
        if(message && message.sguid) {
            User.query({id: message.sguid}, function(data) {
                data.isSocial = message.isSocial;
                data.improva = message.improva;

                $scope.workspace.user = data;
                if(message.update) {
                    User.updateUser(
                        { "id": $scope.workspace.user.sguid },  
                        { user: JSON.stringify(message.update) }, 
                        function(data) {
                            if(message.update.name) {
                                $scope.workspace.user.name = message.update.name;
                            }
                        }
                    );
                }
                
                $scope.workspace.user.points = parseInt($scope.workspace.user.points);
                if(isNaN($scope.workspace.user.points)) {
                    $scope.workspace.user.points = 0;
                }

                var external = false;
                if(message.improva || message.isSocial) {
                    external = true;
                }

                //AuthUser.set(message.sguid, message.token, external);

                if($scope.workspace.user.points == 0) {
                  $cookieStore.put("myProfileTab", 3);
                } else {
                  $cookieStore.put("myProfileTab", 1);
                }

                User.get_friends({id: message.sguid}, function(frends) {
                    $scope.workspace.user.frends = frends;
                    $scope.authUserId = data.sguid;

                    $rootScope.$broadcast('frendLoad');

                    if(message.isSocial) {
                        $rootScope.$broadcast('socialLogined');
                    }

                    if(!message.noRedirect) {
                        $location.path('/my_profile');
                    }
                });
            });    
        }
    });
     */
    /**
     * Авторизация через google plus
     * @param  {[type]} email [description]
     * @param  {[type]} name  [description]
     * @return {[type]}       [description]
    
    $scope.gplusAuth = function(email, name) {
        Social.login({}, {email: email}, function(data) {
            var updateUser = {};
            if(data.was_created) {
                updateUser["name"] = name;
            }

            $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true , update: updateUser, token: data.token});
            $rootScope.$broadcast('loaderHide');

        });
    };
     
    $scope.gplusFalse = function() {
        $rootScope.$broadcast('loaderHide');
    };
    */
    
}