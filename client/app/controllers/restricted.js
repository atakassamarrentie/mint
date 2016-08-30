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
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };


};

