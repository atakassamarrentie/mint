(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.servicesales', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('ons.servicesales', {
                url: '/servicesales',
                templateUrl: 'app/pages/ordersAndSales/saleService/saleservice.html',
                controller: 'saleservicePageCtrl',
                title: 'Service Sales',
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