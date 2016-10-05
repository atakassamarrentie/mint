(function () {
    'use strict';

    angular.module('BlurAdmin.pages.product', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('product', {
                url: '/product',
                templateUrl: 'app/pages/products/product/product.html',
                controller: 'productPageCtrl',
                title: 'Product',
            
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();