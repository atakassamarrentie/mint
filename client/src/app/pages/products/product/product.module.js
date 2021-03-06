(function () {
    'use strict';

    angular.module('BlurAdmin.pages.product.products', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('product.products', {
                url: '/products',
                templateUrl: 'app/pages/products/product/product.html',
                controller: 'productPageCtrl',
                title: 'Product',
                role: ['admin', 'products_read', 'products_write'],
                sidebarMeta: {
                    order: 100
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();