/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.completedOrders')
        .controller('completedOrderPageCtrl', completedOrderPageCtrl)

    /** @ngInject */
    function completedOrderPageCtrl($rootScope, $scope, Order, Product, Partners, Product_category, Payment, sessionService, $filter, $commonModal, toastr, $q) {
        $scope.payments = Payment.find();
        $scope.sessionService = sessionService
        $scope.writeAccess = sessionService.role.indexOf('order_write') > -1 || sessionService.role.indexOf('admin') > -1

        $scope.completedOrdersCollection = Order.find({ filter: { include: ['product', 'partner', 'payment'], where: { completed: true } } }, function (result) {
            $scope.completedOrdersCollection.forEach(function (item) {
                item.expected_date = new Date(item.expected_date)
                item.order_date = new Date(item.order_date)
            })
        })

        $scope.newOrder = {
            order_date: new Date(),
            expected_date: new Date(),
            product: "",
            quantity: 1
        }

        $scope.emptyVal = { id: '', category_name: '-- Clear --' }
        $scope.products = Product.find({ include: 'product_category' })
        $scope.filteredProducts = $scope.products
        $scope.productCategory = {}
        $scope.allCategory = {}
        $scope.partners = Partners.find()
        $scope.displayedCollection = [].concat($scope.completedOrdersCollection);

        $scope.checkIsOlder = function (date) {
            if (new Date(date) <= new Date()) { return "greenrow" }
            else { return "redrow" }
        }

        Product_category.find({}, function (res) {
            $scope.allCategory[0] = $scope.emptyVal
            res.forEach(function (item, index, array) {
                $scope.allCategory[item.id] = item
            })
            $scope.productCategory = $scope.allCategory
        })
        /*  "order_date": 
            "product_name":
            "expected_date":
            "price":
            "total":
            "quantity":
            }*/


        $scope.updateOrder = function (data, item) {
            Order.upsert(item, function (result) {
                toastr.success('Order ' + item.id + ' has been updated successfully');
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + " is a required field"); return "" }
        }

        $scope.productChanged = function (data) {
            if (data) {
                $scope.newItem.$editables[1].scope.$data = data.productCategoryId
                $scope.calcOrder(data)
            }
        }

        $scope.productCategoryChanged = function (data) {
            $scope.price = ""
            $scope.totalprice = ""
            if (data) {
                $scope.filteredProducts = $scope.products.filter(function (item) {
                    return item.productCategoryId == data
                })

            } else {
                $scope.filteredProducts = $scope.products
            }
        }

        $scope.quantityChanged = function (data) {
            $scope.totalprice = $scope.price * data
        }

        $scope.calcOrder = function (data) {
            $scope.price = data.purchase_price
            $scope.totalprice = $scope.newItem.$editables[5].scope.$data * data.purchase_price
        }

        $scope.opened = {};

        $scope.open = function ($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened[elementOpened] = !$scope.opened[elementOpened];
        };

        $scope.deleteItem = function (item) {
            console.log(item)
            var rowId = $scope.completedOrdersCollection.indexOf(item)
            var message = "Do you really want to delete order " + item.product_name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Order.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find order with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.completedOrdersCollection.splice(rowId, 1)
                        }
                        toastr.success('Order ' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        };


    }
})();
