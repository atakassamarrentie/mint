/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.sales')
        .controller('salePageCtrl', salePageCtrl)

    /** @ngInject */
    function salePageCtrl($rootScope, $scope, Sale, Product, Client, Product_category, Payment, sessionService, $filter, $myModal, toastr, $q) {
        $scope.productvalue = {}
        $scope.customPrice = {}
        $scope.payments = Payment.find();
        $scope.salesCollection = Sale.find({ filter: { include: ['product', 'client', 'payment'] } }, function (result) {
            console.log(result)
            $scope.salesCollection.forEach(function (item) {
                item.sale_date = new Date(item.sale_date)
            })
        })
        $scope.emptyVal = { id: '', category_name: '-- Clear --' }
        $scope.products = Product.find({ include: 'product_category' })
        $scope.filteredProducts = $scope.products
        $scope.productCategory = {}
        $scope.allCategory = {}
        $scope.clients = Client.find()
        $scope.displayedCollection = [].concat($scope.salesCollection);

        $scope.addNewItem = function (data) {
            Product_category.find({ filter: { where: { id: data.productCategoryId } } }, function (result) {
                data.product_category = result[0].category_name
                data.price = $scope.productvalue.price
                data.total = $scope.productvalue.totalprice
                data.product_name = data.product.name
                data.userId = sessionService.user.id
                data.username = sessionService.user.username
                Sale.create(data, function (result) {
                    toastr.success('New order has been added successfully with id ' + result.id);
                    $scope.ordersCollection = Sale.find({ filter: { include: ['product', 'partner', 'payment'], where: { completed: false } } }, function (result) {
                        $scope.salesCollection.forEach(function (item) {
                            item.expected_date = new Date(item.expected_date)
                            item.order_date = new Date(item.order_date)
                        })
                        $scope.displayedCollection = [].concat($scope.salesCollection);
                    })
                })
            })
        }

        Product_category.find({}, function (res) {
            $scope.allCategory[0] = $scope.emptyVal
            res.forEach(function (item, index, array) {
                $scope.allCategory[item.id] = item
            })
            $scope.productCategory = $scope.allCategory
        })

        $scope.setTotal = function (prc) {
            console.log(prc)
            $scope.productvalue.totalprice = prc * $scope.newItem.$editables[4].scope.$data
            $scope.productvalue.price = prc
        }

        $scope.clearFields = function () {
            $scope.newsale = { "sale_date": new Date(), "product": "", "quantity": 1 }
            $scope.productvalue.price = ""
            $scope.productvalue.totalprice = ""
            $scope.customPrice.value = false
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

        $scope.switchChanged = function () {
            console.log('changed')
            $scope.productvalue.price = $scope.productvalue.defaultPrice
            $scope.productvalue.totalprice = $scope.productvalue.defaultPrice * $scope.newItem.$editables[4].scope.$data
        }

        $scope.quantityChanged = function (data) {
            $scope.productvalue.totalprice = $scope.productvalue.price * data
        }

        $scope.calcOrder = function (data) {
            $scope.productvalue.price = data.purchase_price
            $scope.productvalue.defaultPrice = data.purchase_price
            $scope.productvalue.totalprice = $scope.newItem.$editables[4].scope.$data * data.purchase_price
        }
    }
})();
