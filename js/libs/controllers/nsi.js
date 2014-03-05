/**
 * Контроллер страницы редактирования лиги
 * @param {[type]} $scope [description]
 */
function NSIController($scope, Leagues, $rootScope, $timeout, LeagueService, TokenService) {
    $scope.fileReaderSupported = window.FileReader != null;
    $scope.uploadRightAway = true;

    $scope.start = function(index, league) {
        var token = TokenService.get() ? TokenService.get() : "";
        var user = $scope.workspace.user.sguid ? $scope.workspace.user.sguid : "";

        var data = new FormData();
        data.append("picture", $scope.selectedFiles[index]);
        data.append("owner_type", 2);

        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("AUTH_TOKEN",token.split('"').join(""));
                xhrObj.setRequestHeader("REMOTE_USER",user.split('"').join(""));
            },
            url: host+'/pictures/'+league.sguid,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'PUT'
        }).done(function(data) {
            $scope.$apply(function(){
                if(data.success) {
                    league.icon = data.message.scheme+"://"+data.message.host+data.message.path;
                }
            });
        });
    }


    $scope.onFileSelect = function($files, league) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for ( var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                function setPreview(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }
                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, league);
            }
        }
    }

    /**
     * Добавляем новую лигу
     */
    $scope.addLeague = function() {
        $rootScope.$broadcast('openModal', { name: 'nsi-add'});

        $timeout(function(){
            $rootScope.$broadcast('nseAddOpen', { size: $scope.workspace.leagues.length});
        }, 100);
    }

    /**
     * Удаление лиги
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.delete = function(value) {
        Leagues.del({id: value.sguid}, {}, function(data) {
            $rootScope.$broadcast('reloadLeagues');
        }); 
    }

    /**
     * Закрываем окошко и иницилизируем пересчет пользователей
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.ok = function(value) {
        $rootScope.$broadcast('loaderShow');

        Leagues.recal({}, {}, function(data) {
            $rootScope.$broadcast('closeModal');
            $rootScope.$broadcast('loaderHide');
            $rootScope.$broadcast('reloadLeagues');
            location.reload();
        }); 
    }

    /**
     * Обновление лиги
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.update = function(value) {

        Leagues.updateLeague(
            {id: value.sguid}, 
            {
                "league": JSON.stringify({
                    max_border: value.max_border,
                    min_border: value.min_border,
                    name: value.name,
                    size: value.size,
                    is_points: value.is_points,
                    font: value.font
                })
            }, function(data) {

            }
        );
    }

    $rootScope.$broadcast('reloadLeagues');
}