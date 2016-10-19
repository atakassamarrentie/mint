/**
 * @author k.danovsky
 * created on 12.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.userMgmt', [
    'BlurAdmin.pages.userMgmt.users'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('usermgmt', {
          url: '/usermgmt',
          template : '<ui-view></ui-view>',
          abstract: true,
          title: 'User Management',
          role: 'admin',
          sidebarMeta: {
            icon: 'ion-man',
            order: 300
          },
          data: {
            requireLogin: true // this property will apply to all children of 'app'
          }
        });
  }

})();
