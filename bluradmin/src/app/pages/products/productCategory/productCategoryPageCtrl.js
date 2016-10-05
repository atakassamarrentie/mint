/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.productCategory')
        .controller('productCategoryPageCtrl', productCategoryPageCtrl)


    /** @ngInject */
    function productCategoryPageCtrl($rootScope, $scope, Product, Product_category, $filter, $myModal, toastr, $q) {
        $scope.productCategoryCollection = Product_category.find()
        $scope.displayedCollection = [].concat($scope.productCategoryCollection);

        $scope.checkName = function (data, id) {
            console.log(data, id)
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Product Category Name cannot be empty');
                d.reject('')
            } else {
                Product_category.find({ filter: { where: { and: [{ category_name: data }, { id: { neq: id } }] } } }, function (res) {
                    console.log(res.length)
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
            console.log(data)
            Product_category.create(data, function (result) {
                
                toastr.success('New product category has been added successfully with id ' + result.id);
                $scope.newProduct = angular.copy({})
                $scope.productCategoryCollection = Product_category.find()
            })
        }

        $scope.updateProductCategory = function (data, id) {
            data.id = id
            Product_category.upsert(data, function (result) {
                console.log(result)
                toastr.success('Product Category ' + id + ' has been updated successfully');
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.productCategoryCollection.indexOf(item)
            var message = "Do you really want to delete product category " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        }

        $rootScope.confirmedDelete = function (id, itemRow) {
            Product_category.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find product category with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.productCategoryCollection.splice(itemRow, 1)
                    }
                    toastr.success('Product category' + id + ' has been deleted successfully');
                }
            })
        }

    }
})();
