(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                templateUrl: 'app/pages/userManagement/users/users.html',
                controller: 'usersPageCtrl',
                title: 'Users',
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    }

})();