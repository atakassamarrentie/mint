(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('ons', {
                url: '/ons',
                templateUrl: 'app/pages/ordersAndSales/ons.html',
                controller: 'onsPageCtrl',
                title: 'Orders and Sales',
                sidebarMeta: {
                    icon: 'ion-cash',
                    order: 20,
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();