(function () {
    'use strict';

    angular.module('BlurAdmin.pages.service.serviceCategory', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('service.serviceCategory', {
                url: '/service_categories',
                templateUrl: 'app/pages/services/serviceCategory/serviceCategory.html',
                controller: 'serviceCategoryPageCtrl',
                title: 'Service Categories',
                role: ['admin','services_read','services_write'],
                sidebarMeta:{
                    order: 200
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();