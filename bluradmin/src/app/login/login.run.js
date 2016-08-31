(function () {
  'use strict';

  angular.module('BlurAdmin')
    .run(testRun);

  /** @ngInject */
  function testRun($rootScope, $window, sessionService) {
   $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && typeof sessionService.token === 'undefined') {
      event.preventDefault();
      //
    }
    $rootScope.$sessionService = sessionService
  });
  }

})();