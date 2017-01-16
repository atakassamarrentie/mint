/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.orders')
        .controller('orderPageCtrl', orderPageCtrl)

    /** @ngInject */
    function orderPageCtrl($rootScope, $scope, Order, Product, Partners, Product_category, Payment, $orderPropModal, $orderCompletedModal, sessionService, $filter, $commonModal, toastr, $q) {

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
            var orderModalDialog = $orderPropModal.open('lg', item.id)
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.ordersCollection.indexOf(item)
            var message = "Do you really want to delete order " + item.product_name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Order.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find order with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.ordersCollection.splice(rowId, 1)
                        }
                        toastr.success('Order ' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        };


        $scope.completeItem = function (item, itemRow) {
            var rowId = $scope.ordersCollection.indexOf(item)
            console.log(rowId)
            console.log(item)
            var dialog = $orderCompletedModal.open('lg',item.id)
            dialog.result.then(function () {
                Order.prototype$updateAttributes({ id: item.id }, { completed: true }
                , function (success) {
                    toastr.success('Order successfully set to completed')
                    $scope.ordersCollection.splice($scope.ordersCollection.indexOf(item), 1)
                }, function (error) {
                    toastr.error(error.data.error.message);
                    if (error.data.error.code == "MIS_PRODUCT") {
                        if (itemRow !== -1) {
                            $scope.ordersCollection.splice(itemRow, 1)
                        }
                    }
                }).$promise
               
            })
            

        }

        $scope.saveNewOrder = function () {
            console.log($scope.newOrder)
            var newOrder = $scope.newOrder
            newOrder.username = sessionService.user.username
            newOrder.userId = sessionService.user.id
            newOrder.partnerName = $scope.newOrder.partner.name
            newOrder.partnerId = $scope.newOrder.partner.id
            newOrder.paymentId = $scope.newOrder.paymentId
            
            Order.create(newOrder,
                function (success) {
                    console.log(success)
                    toastr.success('New order succesfully added to database')
                    $scope.addOrder = false
                    $scope.newOrder = {
                        order_date: new Date(),
                        expected_date: new Date(),
                    }
                    getOrders()
                },
                function (err) {
                    console.log(err)
                    toastr.error(err.data.error.message)
                }
            )
        }

        $scope.closeNewOrder = function () {
            $scope.addOrder = false
            $scope.newOrder = {
                order_date: new Date(),
                expected_date: new Date(),
            }
            $scope.addOrder = false
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        function getOrders() {
            $scope.ordersCollection = Order.find({ filter: { include: ['partner', 'payment'], where: { completed: false } } }, function (result) {
                $scope.ordersCollection.forEach(function (item) {
                    item.expected_date = new Date(item.expected_date)
                    item.order_date = new Date(item.order_date)
                })
            })
            $scope.displayedCollection = [].concat($scope.ordersCollection);
        }

    }
})();
