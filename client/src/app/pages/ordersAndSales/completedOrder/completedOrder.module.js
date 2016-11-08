(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.completedOrders', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('ons.completedOrder', {
                url: '/completedOrder',
                templateUrl: 'app/pages/ordersAndSales/completedOrder/completedOrder.html',
                controller: 'completedOrderPageCtrl',
                title: 'Completed Orders',
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