(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales', [
        'BlurAdmin.pages.ordersAndSales.orders',
        'BlurAdmin.pages.ordersAndSales.completedOrders',
        'BlurAdmin.pages.ordersAndSales.sales'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('ons', {
                url: '/ons',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Orders & Sales',
                
                sidebarMeta: {
                    icon: 'ion-cash',
                    order: 40

                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }
})();