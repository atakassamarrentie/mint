(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pos', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('pos', {
                url: '/pos',
                templateUrl: 'app/pages/pos/pos.html',
                controller: 'posPageCtrl',
                title: 'POS',
                disabled: true,
                role: ['admin','pos_read', 'pos_write'],
                sidebarMeta: {
                    icon: 'ion-ios-cart',
                    order: 1
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();