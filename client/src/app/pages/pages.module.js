/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.ui',
    'BlurAdmin.pages.components',
    'BlurAdmin.pages.form',
    'BlurAdmin.pages.tables',
    'BlurAdmin.pages.charts',
    'BlurAdmin.pages.maps',
    'BlurAdmin.pages.profile',
    'BlurAdmin.pages.product',
    'BlurAdmin.pages.client',
    'BlurAdmin.pages.ordersAndSales',
    'BlurAdmin.pages.userMgmt'
  ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider, $stateProvider, $windowProvider) {
    $urlRouterProvider.otherwise('/product')

 /*   baSidebarServiceProvider.addStaticItem({
      title: 'Products',
      icon: 'ion-bag',
      role: 'admin',
      subMenu: [
        {
          title: 'Product List',
          stateRef: 'product',
        },
        {
          title: 'Product Category',
          stateRef: 'productCategory'
        }
      ]
    })*/

   /*  baSidebarServiceProvider.addStaticItem({
      title: 'Users',
      icon: 'ion-person',
      role: 'admin',
      subMenu: [
        {
          title: 'User List',
          stateRef: 'users',
        }
      ]
    })*/


  /*  baSidebarServiceProvider.addStaticItem({
      title: 'Pages',
      icon: 'ion-document',
      subMenu: [{
        title: 'Sign In',
        fixedHref: '/auth.html',
        blank: true
      }, {
          title: 'Sign Up',
          fixedHref: 'reg.html',
          blank: true
        }, {
          title: 'User Profile',
          stateRef: 'profile'
        }, {
          title: '404 Page',
          fixedHref: '404.html',
          blank: true
        }]
    });
    baSidebarServiceProvider.addStaticItem({
      title: 'Menu Level 1',
      icon: 'ion-ios-more',
      subMenu: [{
        title: 'Menu Level 1.1',
        disabled: true
      }, {
          title: 'Menu Level 1.2',
          subMenu: [{
            title: 'Menu Level 1.2.1',
            disabled: true
          }]
        }]
    });*/
  }

})();