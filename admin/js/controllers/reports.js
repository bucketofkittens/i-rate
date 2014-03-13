/**
 */
function ReportsController($scope, ReportService, $location) {
    $scope.reports = [];
    $scope.currentReport = null;

    $scope.getReportsCallback_ = function(data) {
        $scope.reports = data;
    }

    $scope.getReports = function() {
        ReportService.getAll($scope.getReportsCallback_);
    }

    $scope.openReport = function(report) {
    	$scope.currentReport = report;
        $location.search({"report_profile": report.user.sguid})
    }

    $scope.getReports();
}