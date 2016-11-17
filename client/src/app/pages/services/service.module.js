/**
 * @author k.danovsky
 * created on 12.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.service', [
    'BlurAdmin.pages.service.services',
    'BlurAdmin.pages.service.serviceCategory',
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('service', {
          url: '/service',
          template : '<ui-view></ui-view>',
          abstract: true,
          title: 'Services',
          
          sidebarMeta: {
            icon: 'ion-coffee',
            order: 200
            
          },
          data: {
            requireLogin: true // this property will apply to all children of 'app'
          }
        });
  }

})();
