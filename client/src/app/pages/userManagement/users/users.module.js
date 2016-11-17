(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.users', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('usermgmt.users', {
                url: '/users',
                templateUrl: 'app/pages/userManagement/users/users.html',
                controller: 'usersPageCtrl',
                title: 'Users',
                role: ['admin'],
                sidebarMeta: {
                    order: 10
                },
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();