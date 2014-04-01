// контроллер репортов
function ReportController($scope, ReportService, $location, TokenService, $timeout, $rootScope, LocationService, User) {
    $scope.issetFile = false;

    $scope.isEmailFound = false;

    // форма репорта
    $scope.form = {
        full_name: "",
        email: "",
        additional_info: "",
        user_guid: $location.search().report_user
    }

    $scope.onReportCallback_ = function(dataItem) {
        if($scope.issetFile) {
            var data = new FormData();
            data.append("picture", $scope.selectedFile);
            data.append("owner_type", 4);

            $.ajax({
                url: host+'/pictures/'+dataItem.message.guid,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'PUT'
            }).done(function(data) {
                $scope.$apply(function(){
                    if(data.success) {
                        $rootScope.$broadcast('openModal', {name: "report-success"});
                        $rootScope.$broadcast('loaderHide');
                    }
                });
            });    
        }
    }

    // отправляем репорт на сервер
    $scope.onReport = function() {
        if($scope.issetFile) {
            $rootScope.$broadcast('loaderShow');
            User.test_email({}, {email: $scope.form.email}, function(data) {
                if(data.success) {
                    $scope.isEmailFound = true;
                    $rootScope.$broadcast('loaderHide');
                } else {
                    $scope.isEmailFound = false;
                    ReportService.create($scope.form, $scope.onReportCallback_);
                }
            });
        }
    }

    $scope.onFileSelect = function($files, league) {
        $scope.selectedFile = $files[0];
        $scope.issetFile = true;
    }

    $scope.clearFile = function() {
        $scope.selectedFile = null;
        $scope.issetFile = false;
    }

    $scope.onUpload = function() {
        $timeout(function() {
            $("#report_upload").click();
        }, 0);
    }
}