/**
 */
function ReportsController($scope, ReportService, $location) {
    $scope.reports = [];

    $scope.getReportsCallback_ = function(data) {
        $scope.reports = data;
    }

    $scope.getReports = function() {
        ReportService.getAll($scope.getReportsCallback_);
    }

    $scope.openReport = function(report) {
        $location.search({"report_profile": report.user.sguid, "report": report.sguid});
    }

    $scope.getReports();
}