export default [function () {
    return {
        restrict: 'E',
        scope: {
            user: '=?',
            username: '@name',
            email: '@?',
            icon: '@?'
        },
        templateUrl: 'app/layouts/userDirective.html',
        controller: userController
    }
}]

var userController = ['$scope', '$mdDialog', '$filter', ($scope, $mdDialog, $filter) => {
    $scope.showAlert = function (ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Details of ' + $scope.user.username)
                .textContent($filter('json')($scope.user))
                .ariaLabel('Alert Dialog Demo')
                .ok('Close')
                .targetEvent(ev)
        );
    };
}]