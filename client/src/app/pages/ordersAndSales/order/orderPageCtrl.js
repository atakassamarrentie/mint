/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.orders')
        .controller('orderPageCtrl', orderPageCtrl)



    /** @ngInject */
    function orderPageCtrl($rootScope, $scope, Order, Product, Product_category, $filter, $myModal, toastr, $q) {
        $scope.ordersCollection = Order.find()
        $scope.newOrder = null
        $scope.emptyVal = { id: '', category_name: '-- Clear --' }
        $scope.products = Product.find({ include: 'product_category' })
        $scope.filteredProducts = $scope.products
        $scope.productCategory = {}
        $scope.allCategory = {}
        Product_category.find({}, function (res) {
            $scope.allCategory[0] = $scope.emptyVal
            res.forEach(function (item, index, array) {
                $scope.allCategory[item.id] = item
            })
            console.log($scope.allCategory)
            $scope.productCategory = $scope.allCategory


        })
        $scope.displayedOrdersCollection = [].concat($scope.ordersCollection);

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        $scope.productChanged = function (data) {
            console.log(data)
            if (data) {
                $scope.newItem.$editables[1].scope.$data = data.productCategoryId
            }
        }

        $scope.productCategoryChanged = function (data) {
            console.log("changed: ", data)
            if (data) {
                $scope.filteredProducts = $scope.products.filter(function (item) {
                    return item.productCategoryId == data
                })
               
            } else {
                $scope.filteredProducts = $scope.products
            }
        }

        $scope.setDate = function () {
            console.log('triggered')
            console.log($scope.newItem.$editables[2].scope)
        }
        console.log($scope.productSelect)

    }
})();
