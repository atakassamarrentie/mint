(function () {
  'use strict';

  angular.module('BlurAdmin')
    .run(testRun);

  /** @ngInject */
  function testRun($rootScope, $window, sessionService, UserExt, $state, $urlRouter) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      
      var requireLogin = toState.data.requireLogin;

      try {

        if (sessionService.role && toState.role) {
          if (!sessionService.role.some(function (v) { return toState.role.indexOf(v) >= 0 })) {
            event.preventDefault()
          }
        } else {
          event.preventDefault()
        }
      } catch (e) {
        console.log(e)


        event.preventDefault()
      }
      /*if (sessionService.hasOwnProperty('user')) {
        UserExt.getRolesById({ id: sessionService.user.id }, function (result) {
          //console.log(result)
        })
      }*/


      if (requireLogin && typeof sessionService.token === 'undefined') {
        event.preventDefault();
        //
      }
      $rootScope.$sessionService = sessionService
    });
  }

})();