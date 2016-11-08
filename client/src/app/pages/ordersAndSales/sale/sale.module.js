(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.sales', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('ons.sales', {
                url: '/sales',
                templateUrl: 'app/pages/ordersAndSales/sale/sale.html',
                controller: 'salePageCtrl',
                title: 'Sales',
                role: 'admin',
                sidebarMeta: {
                    order: 300
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();