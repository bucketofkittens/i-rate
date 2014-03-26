/**
 */
function ReportsController($scope, ReportService, $location, $rootScope, Comments) {
    $scope.reports = [];

    $scope.getReportsCallback_ = function(data) {
        angular.forEach(data, function(value, key) {
            Comments.get_by_user({owner_guid: value.sguid, owner_type: 4}, {}, function(data) {
                value.lastComment = data[0];
            });
        });
        $scope.reports = data;
    }

    $scope.getReports = function() {
        ReportService.getAll($scope.getReportsCallback_);
    }

    $scope.openReport = function(report) {
        $location.search({"report_profile": report.user.sguid, "report": report.sguid});
    }

    $scope.$on('updateReport', function () {
        $scope.getReports();
    });

    $scope.getReports();
}