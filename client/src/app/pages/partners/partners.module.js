(function () {
    'use strict';

    angular.module('BlurAdmin.pages.partners', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('partners', {
                url: '/partners',
                templateUrl: 'app/pages/partners/partners.html',
                controller: 'partnersPageCtrl',
                title: 'Partners',
                disabled: true,
                role: ['admin','bla'],
                sidebarMeta: {
                    icon: 'ion-ribbon-a',
                    order: 20
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();