/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.product.productCategory')
        .controller('productCategoryPageCtrl', productCategoryPageCtrl)


    /** @ngInject */
    function productCategoryPageCtrl($rootScope, $scope, Product, sessionService, Product_category, $filter, $commonModal, toastr, $q) {
        $scope.productCategoryCollection = Product_category.find()
        $scope.displayedCollection = [].concat($scope.productCategoryCollection);
        $scope.writeAccess = sessionService.role.indexOf('products_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.checkName = function (data, id) {

            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Product Category Name cannot be empty');
                d.reject('')
            } else {
                Product_category.find({ filter: { where: { and: [{ category_name: data }, { id: { neq: id } }] } } }, function (res) {
                    if (res.length !== 0) {
                        toastr.error('Product Category Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                })
            }
            return d.promise
        }

        $scope.addNewItem = function (data) {
            Product_category.create(data, function (result) {

                toastr.success('New product category has been added successfully with id ' + result.id);
                $scope.newProduct = angular.copy({})
                $scope.productCategoryCollection = Product_category.find()
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.updateProductCategory = function (data, id) {
            data.id = id
            Product_category.upsert(data, function (result) {
                toastr.success('Product Category ' + id + ' has been updated successfully');
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.productCategoryCollection.indexOf(item)
            var message = "Do you really want to delete product category " + item.category_name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Product_category.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find product category with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.productCategoryCollection.splice(rowId, 1)
                        }
                        toastr.success('Product category' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        }
    }
})();
