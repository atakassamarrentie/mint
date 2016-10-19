/**
 * @author k.danovsky
 * created on 12.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.product', [
    'BlurAdmin.pages.product.products',
    'BlurAdmin.pages.product.productCategory',
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('product', {
          url: '/product',
          template : '<ui-view></ui-view>',
          abstract: true,
          title: 'Products',
          
          sidebarMeta: {
            icon: 'ion-bag',
            order: 200
            
          },
          data: {
            requireLogin: true // this property will apply to all children of 'app'
          }
        });
  }

})();
