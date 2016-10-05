(function () {
    'use strict';

    angular.module('BlurAdmin.pages.productCategory', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('productCategory', {
                url: '/product_categories',
                templateUrl: 'app/pages/products/productCategory/productCategory.html',
                controller: 'productCategoryPageCtrl',
                title: 'Product Categories',
            
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();