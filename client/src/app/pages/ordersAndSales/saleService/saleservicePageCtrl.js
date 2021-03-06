/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function (ng) {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.servicesales')
        .controller('saleservicePageCtrl', saleservicePageCtrl)

    /** @ngInject */
    function saleservicePageCtrl($rootScope, UserExt, $scope, Saleservice, Service, Client, Service_category, Payment, sessionService, $filter, $commonModal, toastr, $q) {
        $scope.writeAccess = sessionService.role.indexOf('sale_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.servicevalue = {}
        $scope.customPrice = {}
        $scope.payments = Payment.find();
        $scope.employee = UserExt.find({ filter: { where: { employee: true } } })
        $scope.salesCollection = Saleservice.find({ filter: { include: ['service', 'client', 'payment', 'employee'] } }, function (result) {
            $scope.salesCollection.forEach(function (item) {
                item.sale_date = new Date(item.sale_date)
            })
        })
        $scope.emptyVal = { id: '', category_name: '-- Clear --' }
        $scope.services = Service.find({ include: 'service_category' })
        $scope.filteredServices = $scope.services
        $scope.serviceCategory = {}
        $scope.allCategory = {}
        $scope.clients = Client.find()
        $scope.displayedCollection = [].concat($scope.salesCollection);

        $scope.addNewItem = function (data) {
            console.log(data)
            Service_category.find({ filter: { where: { id: data.serviceCategoryId } } }, function (result) {
                data.service_category = result[0].category_name
                data.price = $scope.servicevalue.price
                data.total = $scope.servicevalue.totalprice
                data.service_name = data.service.name
                data.userId = sessionService.user.id
                data.username = sessionService.user.username
                data.clientId = data.clientId.id
                data.employeeId = data.employee.id
                data.soldBy = data.employee.username
                data.clientName = $scope.newsale.client.first_name.first_name + ", " + $scope.newsale.client.first_name.last_name
                Saleservice.create(data, function (result) {
                    toastr.success('New sale has been added successfully with id ' + result.id);
                    $scope.salesCollection = Saleservice.find({ filter: { include: ['service', 'client', 'payment', 'employee'] } }, function (result) {
                        $scope.salesCollection.forEach(function (item) {
                            item.sale_date = new Date(item.sale_date)
                            $scope.displayedCollection = [].concat($scope.salesCollection);
                        })

                    })
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        }

        Service_category.find({}, function (res) {
            $scope.allCategory[0] = $scope.emptyVal
            res.forEach(function (item, index, array) {
                $scope.allCategory[item.id] = item
            })
            $scope.serviceCategory = $scope.allCategory
        })

        $scope.setTotal = function (prc) {
            $scope.servicevalue.totalprice = prc * $scope.newItem.$editables[5].scope.$data
            $scope.servicevalue.price = prc
        }

        $scope.clearFields = function () {
            $scope.newsale = { "sale_date": new Date(), "service": "", "quantity": 1 }
            $scope.servicevalue.price = ""
            $scope.servicevalue.totalprice = ""
            $scope.customPrice.value = false
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + " is a required field"); return "" }
        }

        $scope.serviceChanged = function (data) {
            if (data) {
                $scope.newItem.$editables[1].scope.$data = data.serviceCategoryId
                $scope.calcOrder(data)
            }
        }

        $scope.serviceCategoryChanged = function (data) {
            $scope.servicevalue.price = ""
            $scope.servicevalue.totalprice = ""
            if (data) {
                $scope.filteredServices = $scope.services.filter(function (item) {
                    return item.serviceCategoryId == data
                })

            } else {
                $scope.filteredServices = $scope.services
            }
        }

        $scope.switchChanged = function () {
            $scope.servicevalue.price = $scope.servicevalue.defaultPrice
            $scope.servicevalue.totalprice = $scope.servicevalue.defaultPrice * $scope.newItem.$editables[5].scope.$data
        }

        $scope.quantityChanged = function (data) {
            $scope.servicevalue.totalprice = $scope.servicevalue.price * data
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.salesCollection.indexOf(item)
            var message = "Do you really want to delete sale " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Saleservice.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find sale with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.salesCollection.splice(rowId, 1)
                        }
                        toastr.success('Service sale ' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        };

        $scope.updateSale = function (data, item) {
            Saleservice.upsert(item, function (result) {
                toastr.success('Sale ' + item.id + ' has been updated successfully');
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.calcOrder = function (data) {
            $scope.servicevalue.price = data.sell_price
            $scope.servicevalue.defaultPrice = data.sell_price
            $scope.servicevalue.totalprice = $scope.newItem.$editables[5].scope.$data * data.sell_price
        }

    }
})();
