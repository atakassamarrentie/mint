/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.users')
        .controller('usersPageCtrl', usersPageCtrl)


    /** @ngInject */
    function usersPageCtrl($rootScope, $scope, UserExt, $filter, $myModal, toastr, $q) {

        $scope.userCollection = UserExt.find()
        $scope.displayedCollection = [].concat($scope.userCollection);

        $scope.addNewItem = function (data) {

            var randomPass = Math.random().toString(36).slice(-8)
            console.log(randomPass)
            UserExt.create({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                password: randomPass
            }, function (result) {
                $scope.userCollection = UserExt.find()
            })
        }

        $scope.changePassword = function (item, row, button) {
            if (button.length >= 8) {
                UserExt.prototype$updateAttributes({ id: item.id }, { password: button }
                    , function (success) {
                        console.log(success)
                    }, function (error) {
                        console.log(error)
                    }).$promise
                row.passwordField = false
            }
        }

        $scope.updateClient = function (data, id) {
            console.log("update")
            data.id = id
            UserExt.updateAll({ where: { id: id } },
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    email: data.email
                },
                function (result) {
                    console.log(result)
                    toastr.success('Client ' + id + ' has been updated successfully');
                })
        }

        $scope.checkUserName = function (data, id) {
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

        $scope.checkEmail = function (data, id) {
            var d = $q.defer();
            if (!data) {
                toastr.error('Email cannot be empty');
                d.reject('')
            } else {
                UserExt.find({ filter: { where: { email: data } } }, function (res) {
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

        $scope.deleteItem = function (item) {
            var rowId = $scope.userCollection.indexOf(item)
            var message = "Do you really want to delete User " + item.firstName + "," + item.lastName + "  (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };

        $rootScope.confirmedDelete = function (id, itemRow) {
            UserExt.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find user with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.userCollection.splice(itemRow, 1)
                    }
                    toastr.success('User ' + id + ' has been deleted successfully');
                }
            })
        }
    }
})();