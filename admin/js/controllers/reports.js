/**
 */
function ReportsController($scope, ReportService) {
    $scope.reports = [];

    $scope.getReportsCallback_ = function(data) {
        $scope.reports = data;
    }

    $scope.getReports = function() {
        ReportService.getAll($scope.getReportsCallback_);
    }

    $scope.getReports();
}