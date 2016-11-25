/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.main.index', [])
        .controller('indexPageCtrl', indexPageCtrl)



    /** @ngInject */
    function indexPageCtrl($rootScope, $scope, $filter, Partners, toastr, $q) {
        $scope.reg = false 
        $scope.reg = $rootScope.reg
    }

})();
