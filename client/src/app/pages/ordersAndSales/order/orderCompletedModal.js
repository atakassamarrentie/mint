/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.orders')
        .controller('orderCompletedModalCtrl', orderCompletedModalCtrl)
        .factory('$orderCompletedModal', orderCompletedModal)

    function orderCompletedModal($uibModal) {
        var open = function (size, id) {
            return $uibModal.open({
                controller: 'orderCompletedModalCtrl',
                controllerAs: 'vm',
                animation: true,
                templateUrl: 'app/pages/ordersAndSales/order/orderCompletedModal.html',
                size: size,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return {
                            id: id,
                        }
                    }
                }
            });
        };
        return {
            open: open
        }
    }


    function orderCompletedModalCtrl($scope, $uibModalInstance, SubOrder, ProductItem, Order, toastr, items) {
        $scope.loadedModal = false
        $scope.doneSave = false
        // Initialize data ------------------------
        var vm = this
        $scope.closeOrder = function() {
            vm.confirm();
        }
        vm.confirm = $uibModalInstance.close;
        vm.cancel = $uibModalInstance.dismiss;
        vm.content = items;
        vm.invoice = {};
        vm.done = function () {
            vm.confirm();
        }
        console.log("vm: ", vm)

        $scope.products = SubOrder.find({ filter: { where: { orderId: vm.content.id } } }, function (success) {
            $scope.loaded = true
        })

        $scope.labels = {}

        // END ------------------------------------

        $scope.deleteItem = function (lbl, productName, productId, quantity) {
            var index = $scope.labels[productName].labels.indexOf(lbl)
            $scope.labels[productName].labels.splice(index, 1)
            if ($scope.labels[productName].labels.length == quantity) {
                vm['p' + productId].valid = 1
            } else {
                vm['p' + productId].valid = ""
            }
        }

        $scope.validateLabel = function (event, label, productName, productId, quantity) {
            if (!$scope.labels[productName]) {
                $scope.labels[productName] = {}
                $scope.labels[productName].labels = []
                $scope.labels[productName].id = productId
            }
            if (event.keyCode == 13) {
                if (label) {
                    ProductItem.count({ where: { label: label } },
                        function (success) {
                            if (success.count > 0) {
                                toastr.error('Duplicated label!')
                            } else {
                                if ($scope.labels[productName].labels.indexOf(label) > -1) {
                                    toastr.error('Duplicated label!')
                                } else {
                                    var valid = true
                                    for (var key in $scope.labels) {
                                        if ($scope.labels[key].labels.indexOf(label) > -1) {
                                            valid = false
                                        }
                                    }
                                    if (valid) {
                                        $scope.labels[productName].labels.push(label)
                                    } else {
                                        toastr.error('Duplicated label!')
                                    }



                                }
                                if ($scope.labels[productName].labels.length == quantity) {
                                    vm['p' + productId].valid = 1
                                } else {
                                    vm['p' + productId].valid = ""
                                }
                            }
                            vm.label = ""
                        })
                } else {
                    toastr.error('Invalid Label')
                }

            }
            $scope.initForm = function (myForm) {
                
                myForm.$setValidity(false)
            }

            $scope.returnForm = function (formName) {
                

                return vm[formName]
            }

        }

        $scope.validateInvoice = function(invoice){
            
            Order.count({where: {invoice: invoice.$modelValue}}, function(cntr){
                console.log(cntr)
                if (cntr.count > 0) {
                    console.log(vm.invoiceForm)
                    vm.invoiceForm.invoiceNumber.$setValidity("uniq", false)
                } else {
                    vm.invoiceForm.invoiceNumber.$setValidity("uniq", true)
                }
            })

        }

        $scope.doneOrder = function () {
            $scope.errs  = ""
            angular.forEach($scope.labels, function (value, key) {
                $scope.labels[key].completed = 0
            })

            
            $scope.pendingSave = true
            angular.forEach($scope.labels, function (value, key) {
                $scope.labels[key].status = 'saving'
                value.labels.forEach(function (label) {
                    ProductItem.create({
                        label: label,
                        invoice: vm.invoice.invoiceNumber,
                        deleted: false,
                        productId: value.id
                    },
                        function (success) {
                            if ($scope.labels[key].completed) { $scope.labels[key].completed += 1 } else {
                                $scope.labels[key].completed = 1
                            }

                            if ($scope.labels[key].completed == value.labels.length) {
                                if ($scope.labels[key].status !== 'error') $scope.labels[key].status = 'done'
                            }

                        },
                        function (error){
                            if (error.data.error.code == "ER_DUP_ENTRY") {
                                $scope.errs += 'The label ' + error.config.data.label + ' is duplicated and will NOT be added to the database!'
                            } else {
                                $scope.errs += error.data.error.message + '\n'
                            }
                            

                            if ($scope.labels[key].completed) { $scope.labels[key].completed += 1 } else {
                                $scope.labels[key].completed = 1
                            }
                                $scope.labels[key].status = 'error'
                        })
                })


            })
            console.log("invoice: ", vm.invoiceForm.invoiceNumber.$viewValue)
            Order.prototype$updateAttributes({ id: vm.content.id }, { invoice: vm.invoiceForm.invoiceNumber.$viewValue }
                , function (success) {
                    console.log(success)
                }
            )
            $scope.pendingSave = false
            $scope.doneSave = true
        }

        $scope.loadedModal = true
    }
} ());