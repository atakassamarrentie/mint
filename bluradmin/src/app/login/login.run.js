(function () {
  'use strict';

  angular.module('BlurAdmin')
    .run(testRun);

  /** @ngInject */
  function testRun($rootScope, $window) {
   $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = !toState.data.requireLogin;

    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();
      //
    }
  });
  }

})();