/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.orders')
        .controller('orderPageCtrl', orderPageCtrl)

    /** @ngInject */
    function orderPageCtrl($rootScope, $scope, Order, Product, Partners, Product_category, Payment, sessionService, $filter, $myModal, toastr, $q) {
        $scope.payments = Payment.find();
        $scope.customPrice = {}
        $scope.productvalue = {}
        $scope.sessionService = sessionService
        $scope.ordersCollection = Order.find({ filter: { include: ['product', 'partner', 'payment'], where: { completed: false } } }, function (result) {
            $scope.ordersCollection.forEach(function (item) {
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
        $scope.displayedCollection = [].concat($scope.ordersCollection);

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
        $scope.addNewItem = function (data) {
            
            Product_category.find({ filter: { where: { id: data.productCategoryId } } }, function (result) {
                data.product_category = result[0].category_name
                data.price = $scope.productvalue.price
                data.total = $scope.productvalue.totalprice
                data.product_name = data.product.name
                data.userId = sessionService.user.id
                data.username = sessionService.user.username

                Order.create(data, function (result) {
                    toastr.success('New order has been added successfully with id ' + result.id);

                    $scope.ordersCollection = Order.find({ filter: { include: ['product', 'partner', 'payment'], where: { completed: false } } }, function (result) {
                        $scope.ordersCollection.forEach(function (item) {
                            item.expected_date = new Date(item.expected_date)
                            item.order_date = new Date(item.order_date)
                        })
                        $scope.displayedCollection = [].concat($scope.ordersCollection);
                    })
                })

            })
        }
        $scope.setTotal = function (prc) {
            console.log(prc)
            $scope.productvalue.totalprice = prc * $scope.newItem.$editables[5].scope.$data
            $scope.productvalue.price = prc
        }

        $scope.clearFields = function () {
            $scope.newOrder = { "order_date": new Date(), "expected_date": new Date(), "product": "", "quantity": 1 }
            $scope.productvalue.price = ""
            $scope.productvalue.totalprice = ""
            $scope.customPrice.value = false
        }
        $scope.updateOrder = function (data, item) {
            Order.upsert(item, function (result) {
                toastr.success('Order ' + item.id + ' has been updated successfully');
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
            $scope.productvalue.price = ""
            $scope.productvalue.totalprice = ""
            if (data) {
                $scope.filteredProducts = $scope.products.filter(function (item) {
                    return item.productCategoryId == data
                })

            } else {
                $scope.filteredProducts = $scope.products
            }
        }

        $scope.switchChanged = function(){
            console.log('changed')
            $scope.productvalue.price = $scope.productvalue.defaultPrice
            $scope.productvalue.totalprice = $scope.productvalue.defaultPrice * $scope.newItem.$editables[5].scope.$data
        }

        $scope.quantityChanged = function (data) {
            $scope.productvalue.totalprice = $scope.productvalue.price * data
        }

        $scope.calcOrder = function (data) {
            $scope.productvalue.price = data.purchase_price
            $scope.productvalue.defaultPrice = data.purchase_price
            $scope.productvalue.totalprice = $scope.newItem.$editables[5].scope.$data * data.purchase_price
        }

        $scope.opened = {};

        $scope.open = function ($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened[elementOpened] = !$scope.opened[elementOpened];
        };

        $scope.deleteItem = function (item) {
            var rowId = $scope.ordersCollection.indexOf(item)
            var message = "Do you really want to delete order " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };


        $rootScope.confirmedDelete = function (id, itemRow) {
            Order.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find order with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.ordersCollection.splice(itemRow, 1)
                    }
                    toastr.success('Order ' + id + ' has been deleted successfully');
                }
            })
        }

        $scope.completeItem = function (item, itemRow) {
            Order.prototype$updateAttributes({ id: item.id }, { completed: true }
                , function (success) {
                    toastr.success('Order successfully set to completed')
                }, function (error) {
                    toastr.error('Error: ' + error);
                }).$promise
            $scope.ordersCollection.splice($scope.ordersCollection.indexOf(item), 1)
        }

    }
})();
