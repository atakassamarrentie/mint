/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('dashboard', {
          

              url: '/dashboard',
              templateUrl: 'app/pages/dashboard/dashboard.html',
              title: 'Dashboard',
              sidebarMeta: {
                icon: 'ion-android-home',
                order: 0,
              },
              data: {
                requireLogin: true // this property will apply to all children of 'app'
              }
        });
  }

})();
