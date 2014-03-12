// контроллер репортов
function ReportController($scope, ReportService, $location, TokenService, $timeout, $rootScope) {
    // форма репорта
    $scope.form = {
        full_name: "",
        email: "",
        additional_info: "",
        user_guid: $location.search().report_user
    }

    $scope.onReportCallback_ = function(dataItem) {
        var data = new FormData();
        data.append("picture", $scope.selectedFiles[0]);
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
                }
            });
        });
    }

    // отправляем репорт на сервер
    $scope.onReport = function() {
        ReportService.create($scope.form, $scope.onReportCallback_);
    }

    $scope.fileReaderSupported = window.FileReader != null;
    $scope.uploadRightAway = true;


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
            if($scope.uploadRightAway) {
                //$scope.start(i, league);
            }
        }
    }

    $scope.onUpload = function() {
        $("#report_upload").click();
    }
}