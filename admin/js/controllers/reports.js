/**
 */
function ReportsController($scope, ReportService) {
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
    }

    $scope.getReports();
}