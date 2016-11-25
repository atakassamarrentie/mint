/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.users')
        .controller('usersPageCtrl', usersPageCtrl)


    /** @ngInject */
    function usersPageCtrl($state, sessionService, $scope, UserExt, $filter, $commonModal, toastr, $q) {
        $scope.additem = { visible: false }
        $scope.newUser = {}
        $scope.writeAccess = sessionService.role.indexOf('users_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.userCollection = UserExt.find()
        $scope.displayedCollection = [].concat($scope.userCollection);

        $scope.addNewItem = function () {

            var randomPass = Math.random().toString(36).slice(-8)
            console.log(randomPass)
            UserExt.create({
                firstName: $scope.newUser.firstName,
                lastName: $scope.newUser.lastName,
                username: $scope.newUser.username,
                email: $scope.newUser.email,
                password: randomPass
            }, function (result) {
                toastr.success('User added successfully')
                $scope.resetForm()
                $scope.additem.visible = false
                $scope.userCollection = UserExt.find(function(success){
                
                })
                
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.resetForm = function () {
            $scope.additem.visible = false
            $scope.newUser = {}
            $scope.userErr = { message: "" }
            $scope.mailErr = { message: "" }

        }

        $scope.changePassword = function (item, row, button) {
            if (button.length >= 8) {
                UserExt.prototype$updateAttributes({ id: item.id }, { password: button }
                    , function (success) {
                        toastr.success('Password changed successfully')

                    }, function (error) {
                        toastr.error(error.data.error.message)
                    }).$promise
                row.passwordField = false
            }
        }

        $scope.additem.show = function () {
            $scope.additem.visible = true
        }

        $scope.updateClient = function (data, id) {
            data.id = id
            UserExt.updateAll({ where: { id: id } },
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    email: data.email,
                    employee: data.employee
                },
                function (result) {
                    toastr.success('Client ' + id + ' has been updated successfully');
                })
        }



        $scope.viewProfile = function (item) {
            $state.go('profile', { userId: item.id });
        }

        $scope.yesno = [

            { value: true, text: 'yes' },
            { value: false, text: 'no' },
        ]

        $scope.unameValid = function () {

            $scope.userErr = { message: "" }

            var username = $scope.newUser.username
            if (username) {
                $scope.newUserForm.username.$setValidity("custom", false)
                if (username.length >= 6) {
                    $scope.pending = true
                    UserExt.isUsernameExists({ username: username }, function (res) {
                        if (res.result) {
                            $scope.userErr = { error: true, message: "Username already exists" }
                        } else {
                            $scope.userErr = { error: false, message: "Valid username" }
                        }
                        $scope.pending = false
                        $scope.newUserForm.username.$setValidity("custom", !$scope.userErr.error)
                    })
                } else {
                    $scope.userErr = { error: true, message: "Username must be at least 6 characters" }
                }
                $scope.newUserForm.username.$setValidity("custom", !$scope.userErr.error)
            }
        }

        $scope.mailValid = function () {
            var email = $scope.newUser.email
            $scope.mailErr = { message: "" }
            if (email) {
                $scope.newUserForm.email.$setValidity("custom", false)
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(email)) {
                    $scope.pending2 = true
                    UserExt.isEmailExists({ email: email }, function (res) {
                        if (res.result) {
                            $scope.mailErr = { error: true, message: "Email already exists" }
                        } else {
                            $scope.mailErr = { error: false, message: "Valid email" }
                        }
                        $scope.pending2 = false
                        $scope.newUserForm.email.$setValidity("custom", !$scope.mailErr.error)
                    })

                } else {
                    $scope.mailErr = { error: true, message: "Not a valid email" }
                }
                $scope.newUserForm.email.$setValidity("custom", !$scope.mailErr.error)
            }
        }


        $scope.deleteItem = function (item) {
            var rowId = $scope.userCollection.indexOf(item)
            var message = "Do you really want to delete User " + item.firstName + "," + item.lastName + "  (with id " + item.id + ")"
            var title = "Confirm"
            var dialog =  $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function(result){
                UserExt.destroyById({ id: item.id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find user with id ' + item.id);
                } else {
                    
                    if (rowId !== -1) {
                        $scope.userCollection.splice(rowId, 1)
                        $scope.displayedCollection = [].concat($scope.userCollection)
                    }
                    toastr.success('User ' + item.id + ' has been deleted successfully');
                }
            }, function (err) {
                toastr.error(err.data.error.message)
            })
            })
        }

    }
})();