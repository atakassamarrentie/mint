(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.roles', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('usermgmt.roles', {
                url: '/roles',
                templateUrl: 'app/pages/userManagement/roles/roles.html',
                controller: 'rolesPageCtrl',
                title: 'Roles',
                role: ['admin','users_read', 'users_write'],
                sidebarMeta: {
                    order: 20
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();