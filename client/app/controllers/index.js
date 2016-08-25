export default [
    '$scope',
    '$cookies',
    'sessionService',
    indexCtrl
];

function indexCtrl($scope, $cookies, sessionService) {
    $scope.test = "Hello World!!"
    $scope.loginPageTemplate = "/app/layouts/login.html"
    $scope.restrictedContentTemplate = "/app/layouts/restricted.html"
    $scope.sessionService = sessionService
    $scope.sessionService.token = $scope.sessionService.token || $cookies.get('token')
    sessionService.token = sessionService.token || $cookies.get('token')
    sessionService.user = $cookies.getObject('user') || sessionService.user
}