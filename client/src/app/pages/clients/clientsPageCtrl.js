/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.client')
        .controller('clientPageCtrl', clientPageCtrl)


    /** @ngInject */
    function clientPageCtrl($rootScope, $scope, Client, UserExt, $filter, $myModal, toastr, $q) {

        $scope.clientCollection = Client.find()
        $scope.displayedCollection = [].concat($scope.clientCollection);

        $scope.addNewItem = function (data) {
            Client.create(data, function (result) {
                toastr.success('New client has been added successfully with id ' + result.id);
                $scope.newItem = angular.copy({})
                $scope.userCollection = Client.find()
                if ($scope.switchUser) {
                    var randomPass = Math.random().toString(36).slice(-8)
                    console.log(randomPass)
                    UserExt.create({
                        firstName: data.first_name,
                        lastName: data.last_name,
                        username: data.username,
                        email: data.email,
                        password: randomPass
                    }, function(result){
                        console.log(result)
                    })
                    

                }
            })
        }

        $scope.updateClient = function (data, id) {
            console.log("update")
            data.id = id
            Client.upsert(data, function (result) {
                console.log(result)
                toastr.success('Client ' + id + ' has been updated successfully');
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.clientCollection.indexOf(item)
            var message = "Do you really want to delete client " + item.first_name + "," + item.last_name + "  (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };

        $scope.checkUserName = function (data, switchUser) {
            $scope.switchUser = switchUser
            if (switchUser) {
                console.log(data)
                var d = $q.defer();
                if (!data) {
                    toastr.error('Username cannot be empty');
                    d.reject('')
                } else {
                    UserExt.find({ filter: { where: { username: data } } }, function (res) {
                        console.log(res.length)
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
                        console.log(res.length)
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
