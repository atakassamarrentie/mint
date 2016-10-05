/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales')
        .controller('onsPageCtrl', onsPageCtrl)
        


    /** @ngInject */
    function onsPageCtrl($rootScope, $scope, Order, $filter, $myModal, toastr, $q) {
        $scope.ordersCollection = Order.find()
        $scope.displayedOrdersCollection = [].concat($scope.ordersCollection);

          $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }
    }
})();
