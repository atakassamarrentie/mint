/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.sales')
        .controller('salePageCtrl', salePageCtrl)

    /** @ngInject */
    function salePageCtrl($rootScope, UserExt, $scope, Sale, Product, Client, Product_category, Payment, sessionService, $filter, $commonModal, toastr, $q) {
        $scope.writeAccess = sessionService.role.indexOf('sale_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.productvalue = {}
        $scope.customPrice = {}
        $scope.payments = Payment.find();
        $scope.employee = UserExt.find({ filter: { where: { employee: true } } })

        $scope.salesCollection = Sale.find({ filter: { include: ['product', 'client', 'payment', 'employee'] } }, function (result) {
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
                data.clientId = data.clientId.id
                data.employeeId = data.employee.id
                data.soldBy = data.employee.username
                data.clientName = $scope.newsale.client.first_name.first_name + ", " + $scope.newsale.client.first_name.last_name 
                Sale.create(data, function (result) {
                    toastr.success('New sale has been added successfully with id ' + result.id);
                    $scope.salesCollection = Sale.find({ filter: { include: ['product', 'client', 'payment', 'employee'] } }, function (result) {
                        $scope.salesCollection.forEach(function (item) {
                            item.sale_date = new Date(item.sale_date)
                        })
                        $scope.displayedCollection = [].concat($scope.salesCollection);
                    })
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        }

        $scope.updateSale = function (data, item) {
            Sale.upsert(item, function (result) {
                toastr.success('Sale ' + item.id + ' has been updated successfully');
            }, function (err) {
                toastr.error(err.data.error.message)
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
            $scope.productvalue.totalprice = prc * $scope.newItem.$editables[5].scope.$data
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
            $scope.productvalue.price = $scope.productvalue.defaultPrice
            $scope.productvalue.totalprice = $scope.productvalue.defaultPrice * $scope.newItem.$editables[5].scope.$data
        }

        $scope.quantityChanged = function (data) {
            $scope.productvalue.totalprice = $scope.productvalue.price * data
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.salesCollection.indexOf(item)
            var message = "Do you really want to delete sale " + item.product.name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Sale.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find sale with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.salesCollection.splice(rowId, 1)
                        }
                        toastr.success('Sale ' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        };


        $scope.calcOrder = function (data) {
            $scope.productvalue.price = data.sell_price
            $scope.productvalue.defaultPrice = data.sell_price
            $scope.productvalue.totalprice = $scope.newItem.$editables[5].scope.$data * data.sell_price
        }

         }
})();
