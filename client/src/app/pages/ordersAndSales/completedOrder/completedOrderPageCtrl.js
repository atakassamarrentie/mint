/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.completedOrders')
        .controller('completedOrderPageCtrl', completedOrderPageCtrl)

    /** @ngInject */
    function completedOrderPageCtrl($rootScope, $scope, Order, Product, Partners, Product_category, Payment, $completedOrdersPropModal, sessionService, $filter, $commonModal, toastr, $q) {

        $scope.sessionService = sessionService
        $scope.writeAccess = sessionService.role.indexOf('order_write') > -1 || sessionService.role.indexOf('admin') > -1
        getOrders()
        $scope.newOrder = {
            order_date: new Date(),
            expected_date: new Date(),
        }
        $scope.payments = Payment.find()
        $scope.emptyVal = { id: '', category_name: '-- Clear --' }
        $scope.partners = Partners.find()


        $scope.checkIsOlder = function (date) {
            if (new Date(date) <= new Date()) { return "greenrow" }
            else { return "redrow" }
        }

        $scope.open = function ($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened[elementOpened] = !$scope.opened[elementOpened];
        };

        
    $scope.updateOrder = function (item) {
            var orderModalDialog = $completedOrdersPropModal.open('lg', item.id)
        }




        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        function getOrders() {
            $scope.ordersCollection = Order.find({ filter: { include: ['partner', 'payment'], where: { completed: true } } }, function (result) {
                $scope.ordersCollection.forEach(function (item) {
                    item.expected_date = new Date(item.expected_date)
                    item.order_date = new Date(item.order_date)
                })
            })
            $scope.displayedCollection = [].concat($scope.ordersCollection);
        }

    }
})();
