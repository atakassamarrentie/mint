/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.product')
        .controller('productPageCtrl', productPageCtrl)


    /** @ngInject */
    function productPageCtrl($rootScope, $scope, Product, Product_category, $filter, $myModal, toastr, $q) {
        $scope.newProduct = {}
        $scope.productCategory = {}

        $scope.productCollection = Product.find({ filter: { include: 'productCategory' } })
        $scope.displayedCollection = [].concat($scope.productCollection);

        Product_category.find({}, function (res) {
            res.forEach(function (item, index, array) {
                $scope.productCategory[item.id] = item
            })
        })

        $scope.addNewItem = function (data) {
            Product.create(data, function (result) {
                console.log(result)
                toastr.success('New product has been added successfully with id ' + result.id );
                $scope.newProduct = angular.copy({})
                $scope.productCollection = Product.find({ filter: { include: 'productCategory' } })
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.productCollection.indexOf(item)
            var message = "Do you really want to delete product " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };

        $scope.updateProduct = function (data, id) {
            data.id = id
            Product.upsert(data, function (result) {
                console.log(result)
                toastr.success('Product ' + id + ' has been updated successfully');
            })
        }

        $scope.showCategory = function (catId) {
            return ($scope.productCategory[catId]) ? $scope.productCategory[catId].category_name : ''
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        $scope.checkName = function (data, id) {
            console.log(data, id)
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Product Name cannot be empty');
                d.reject('')
            } else {
                Product.find({ filter: { where: { and: [{ name: data }, { id: { neq: id } }] } } }, function (res) {
                    console.log(res.length)
                    if (res.length !== 0) {
                        toastr.error('Product Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                })
            }
            return d.promise
        }

        $rootScope.confirmedDelete = function (id, itemRow) {
            Product.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find product with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.productCollection.splice(itemRow, 1)
                    }
                    toastr.success('Product ' + id + ' has been deleted successfully');
                }
            })
        }

    }
})();
