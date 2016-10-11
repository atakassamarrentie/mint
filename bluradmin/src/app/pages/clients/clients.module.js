(function () {
    'use strict';

    angular.module('BlurAdmin.pages.client', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('client', {
                url: '/client',
                templateUrl: 'app/pages/clients/clients.html',
                controller: 'clientPageCtrl',
                title: 'Clients',
                disabled: true,
                sidebarMeta: {
                    icon: 'ion-person-stalker',
                    order: 10,
                    role: 'admin'
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();