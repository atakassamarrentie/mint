(function () {
    'use strict';

    angular.module('BlurAdmin.pages.product.productCategory', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('product.productCategory', {
                url: '/product_categories',
                templateUrl: 'app/pages/products/productCategory/productCategory.html',
                controller: 'productCategoryPageCtrl',
                title: 'Product Categories',
                role: ['admin','products_read', 'products_write'],
                sidebarMeta:{
                    order: 200
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();