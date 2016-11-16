/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.client')
        .controller('clientPageCtrl', clientPageCtrl)


    /** @ngInject */
    function clientPageCtrl($rootScope, $scope, Client, UserExt, Sale, Saleservice, $filter, $myModal, $clientPropModal, toastr, $q) {

        $scope.clientCollection = Client.find()
        $scope.prodBought = {}
        $scope.serviceBought = {}

        $scope.addNewItem = function (data) {
            Client.create(data, function (result) {
                toastr.success('New client has been added successfully with id ' + result.id);
                $scope.newItem = angular.copy({})
                $scope.clientCollection = Client.find()
                $scope.displayedCollection = [].concat($scope.clientCollection);
            })
        }

        $scope.prodBought.open = function () {
            Sale.find({ filter: { where: { clientId: $scope.newClient.id } } }, function (result) {
                $scope.prodBought.sum = 0
                result.forEach(function (item) {
                    $scope.prodBought.sum += item.total
                })
                $scope.prodBoughtCollection = result
                $scope.displayedprodBoughtCollection = [].concat($scope.prodBoughtCollection);

            })

        }

        $scope.serviceBought.open = function () {
            Saleservice.find({ filter: { where: { clientId: $scope.newClient.id } } }, function (result) {
                $scope.serviceBought.sum = 0
                result.forEach(function (item) {
                    $scope.serviceBought.sum += item.total
                })
                $scope.serviceBoughtCollection = result
                $scope.displayedserviceBoughtCollection = [].concat($scope.serviceBoughtCollection);

            })
        }

        $scope.updateClient = function (data, id) {
            data.id = id
            Client.upsert(data, function (result) {
                toastr.success('Client ' + id + ' has been updated successfully');
                $scope.clientCollection = Client.find()
                $scope.displayedCollection = [].concat($scope.clientCollection);
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.clientCollection.indexOf(item)
            var message = "Do you really want to delete client " + item.first_name + "," + item.last_name + "  (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };

        $scope.editItem = function (item) {
            $scope.editable = false
            var rowId = $scope.clientCollection.indexOf(item)
            var dialog = $clientPropModal.open('lg', item, rowId, false)
            dialog.result.then(function () {
                $scope.clientCollection = Client.find()
                $scope.displayedCollection = [].concat($scope.clientCollection);
            })

        }

        $scope.edit = function () {
            $scope.editable = true
        }



        $scope.createItem = function () {
            
            var dialog = $clientPropModal.open('lg', null, null, true)
            $scope.editable = true
            dialog.result.then(function () {
                $scope.clientCollection = Client.find()
                $scope.displayedCollection = [].concat($scope.clientCollection);
            })
        }

        $scope.checkUserName = function (data, switchUser) {
            $scope.switchUser = switchUser
            if (switchUser) {
                var d = $q.defer();
                if (!data) {
                    toastr.error('Username cannot be empty');
                    d.reject('')
                } else {
                    UserExt.find({ filter: { where: { username: data } } }, function (res) {
                        if (res.length !== 0) {
                            toastr.error('Username must be unique');
                            d.reject('')
                        }
                        d.resolve()

                    })
                }
                return d.promise
            }
        }

        $rootScope.confirmedDelete = function (id, itemRow) {
            Client.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find product with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.clientCollection.splice(itemRow, 1)
                    }
                    toastr.success('Product ' + id + ' has been deleted successfully');
                }
            })
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        $scope.checkEmail = function (data, switchUser) {
            if (switchUser) {
                var d = $q.defer();
                if (!data) {
                    toastr.error('Email cannot be empty');
                    d.reject('')
                } else {
                    Client.find({ filter: { where: { email: data } } }, function (res) {
                        if (res.length !== 0) {
                            toastr.error('Email must be unique');
                            d.reject('')
                        }
                        d.resolve()
                    })
                }
                return d.promise
            }
        }

    }
})();
