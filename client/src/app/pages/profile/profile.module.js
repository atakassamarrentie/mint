/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('profile', {
          url: '/profile',
          title: 'Profile',
          templateUrl: 'app/pages/profile/profile.html',
          controller: 'ProfilePageCtrl',
          role: ['admin', 'everyone', 'users_read', 'users_write'],
          params: {
            userId: null
          },
          data: {
            requireLogin: true // this property will apply to all children of 'app'
          }
        });
  }

})();
