(function () {
    'use strict';

    angular.module('BlurAdmin.pages.service.services', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('service.services', {
                url: '/services',
                templateUrl: 'app/pages/services/service/service.html',
                controller: 'servicePageCtrl',
                title: 'Service',
                role: 'admin',
                sidebarMeta: {
                    order: 100
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();