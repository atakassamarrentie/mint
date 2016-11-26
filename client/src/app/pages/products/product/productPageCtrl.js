/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.product.products')
        .controller('productPageCtrl', productPageCtrl)


    /** @ngInject */
    function productPageCtrl($rootScope, $scope, Product, Product_category, sessionService, $filter, $productInvModal, $commonModal, toastr, $q) {
        $scope.newProduct = {}
        $scope.productCategory = {}
        $scope.writeAccess = sessionService.role.indexOf('products_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.productCollection = Product.find({ filter: { include: ['productCategory', 'productItem'] } }, function (result) {
            $scope.productCollection.forEach(function (item, index) {
                $scope.productCollection[index].fulfilled = item.reorder >= item.productItem.length
            })
        })

        $scope.displayedCollection = [].concat($scope.productCollection);

        Product_category.find({}, function (res) {
            res.forEach(function (item, index, array) {
                $scope.productCategory[item.id] = item
            })
        })

        $scope.addNewItem = function (data) {
            data.inventory = 0
            Product.create(data, function (result) {

                toastr.success('New product has been added successfully with id ' + result.id);


                $scope.productCollection = Product.find({ filter: { include: ['productCategory', 'productItem'] } }, function (result) {
                    $scope.productCollection.forEach(function (item, index) {
                        $scope.productCollection[index].fulfilled = item.reorder >= item.productItem.length
                    })
                })

                $scope.displayedCollection = [].concat($scope.productCollection);

            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.productCollection.indexOf(item)
            var message = "Do you really want to delete product " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Product.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find product with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.productCollection.splice(rowId, 1)
                        }
                        toastr.success('Product ' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        };

        $scope.updateProduct = function (data, id) {
            data.id = id
            Product.upsert(data, function (result) {
                toastr.success('Product ' + id + ' has been updated successfully');
                $scope.displayedCollection.forEach(function (item, index) {
                    if (item.id == id) {
                        $scope.displayedCollection[index].fulfilled = item.reorder >= item.productItem.length
                    }

                })
            }, function (err) {
                toastr.error(err.data.error.message)
            }
            )

        }

        $scope.inventory = function (itm) {
            var rowId = $scope.productCollection.indexOf(itm)

            var invDialog = $productInvModal.open('lg', itm, rowId)
            invDialog.result.then(function () { }, function () {
                $scope.productCollection = Product.find({ filter: {include: ['productCategory', 'productItem']  } }, function (result) {
                    $scope.productCollection.forEach(function (item, index) {
                        $scope.productCollection[index].fulfilled = item.reorder >= item.productItem.length
                    })
                })

                $scope.displayedCollection = [].concat($scope.productCollection);
            })
        }

        $scope.showCategory = function (catId) {
            return ($scope.productCategory[catId]) ? $scope.productCategory[catId].category_name : ''
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        $scope.checkName = function (data, id) {
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Product Name cannot be empty');
                d.reject('')
            } else {
                Product.find({ filter: { where: { and: [{ name: data }, { id: { neq: id } }] } } }, function (res) {
                    if (res.length !== 0) {
                        toastr.error('Product Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                })
            }
            return d.promise
        }
    }
})();
