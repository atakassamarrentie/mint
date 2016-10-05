export default [
    '$scope',
    '$mdSidenav',

    sideMenuCtrl
];

function sideMenuCtrl($scope, $mdSidenav, User) {
    $scope.sideMenuTemplate = "/app/layouts/sidemenu.html"
    
};

