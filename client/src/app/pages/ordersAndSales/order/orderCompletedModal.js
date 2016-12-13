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


    function orderCompletedModalCtrl($scope, $uibModalInstance, SubOrder, ProductItem, toastr, items) {
        // Initialize data ------------------------
        var vm = this
        vm.confirm = $uibModalInstance.close;
        vm.cancel = $uibModalInstance.dismiss;
        vm.content = items;
        vm.invoice = {};
        vm.done = function () {
            vm.confirm();
        }

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
                            console.log(success.count)
                            if (success.count > 0) {
                                toastr.error('Duplicated label!')
                            } else {

                                if ($scope.labels[productName].labels.indexOf(label) > -1) {
                                    toastr.error('Duplicated label!')
                                } else {
                                    $scope.labels[productName].labels.push(label)
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
                console.log(myForm)
                myForm.$setValidity(false)
            }

            $scope.returnForm = function (formName) {
                console.log("sdsd", formName)

                return vm[formName]
            }

        }

        $scope.doneOrder = function () {
            angular.forEach($scope.labels, function (value, key) {
                $scope.labels[key].completed = 0
            })

            console.log($scope.labels)
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
                    function(success){
                        if ($scope.labels[key].completed) {$scope.labels[key].completed += 1} else {
                            $scope.labels[key].completed = 1
                        }

                        if ($scope.labels[key].completed == value.labels.length) {
                            $scope.labels[key].status = 'done'
                        }
                        
                    })
                })
                
                
            })
            $scope.pendingSave = false
        }


    }
} ());