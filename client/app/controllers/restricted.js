export default [
    '$scope',
    'sessionService',
    '$mdSidenav',

    'UserExt',
    restrictedCtrl
];

function restrictedCtrl($scope, sessionService, $mdSidenav, User) {
    $scope.logout = sessionService.logout;
    $scope.users = User.find();
    $scope.sidemenuTemplate = '/app/layouts/sidemenu.html'
    $scope.toggleLeft = buildToggler('left');
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        }
    }

};

