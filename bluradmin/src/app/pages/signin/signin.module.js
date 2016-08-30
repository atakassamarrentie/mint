/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.signin', [])
    .config(routeConfig);

  
  function routeConfig($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('singin', {
          url: '/signin',
          //templateUrl : 'app/pages/signin/signin.html',
          //controller: 'loginCtrl',
          title: 'signin',
          data: {
            requireLogin: true // this property will apply to all children of 'app'
          },
          sidebarMeta: {
            icon: 'ion-compose',
            order: 50,
          },
        })
       
  }

})();
