(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.orders', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('ons.order', {
                url: '/order',
                templateUrl: 'app/pages/ordersAndSales/order/order.html',
                controller: 'orderPageCtrl',
                title: 'Orders',
                role: 'admin',
                sidebarMeta: {
                    order: 200
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();