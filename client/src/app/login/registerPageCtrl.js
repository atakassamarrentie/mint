/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.main.register', [])
        .controller('registerPageCtrl', registerPageCtrl)

    /** @ngInject */
    function registerPageCtrl($rootScope, sessionService, $scope, $filter, Partners, $myModal, toastr, $q, UserExt, $timeout) {
        $scope.regPage = function () {
            sessionService.reg = false
        }

        $scope.unameValid = function () {

            $scope.userErr = { message: "" }

            var username = $scope.reg.username
            if (username) {
                $scope.regForm.username.$setValidity("custom", false)
                if (username.length >= 6) {
                    $scope.pending = true
                    UserExt.isUsernameExists({ username: username }, function (res) {
                        if (res.result) {
                            $scope.userErr = { error: true, message: "Username already exists" }
                        } else {
                            $scope.userErr = { error: false, message: "Valid username" }
                        }
                        $scope.pending = false
                        $scope.regForm.username.$setValidity("custom", !$scope.userErr.error)
                    })
                } else {
                    $scope.userErr = { error: true, message: "Username must be at least 6 characters" }
                }
                $scope.regForm.username.$setValidity("custom", !$scope.userErr.error)
            }
        }

        $scope.mailValid = function () {
            var email = $scope.reg.email
            $scope.mailErr = {message : ""}
            if (email) {
                $scope.regForm.email.$setValidity("custom", false)
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
                        $scope.regForm.email.$setValidity("custom", !$scope.mailErr.error)
                    })

                } else {
                    $scope.mailErr = { error: true, message: "Not a valid email" }
                }
                $scope.regForm.email.$setValidity("custom", !$scope.mailErr.error)
            }
        }

        $scope.register = function (user) {
            $scope.userErr = $scope.mailErr = ""
            sessionService.register(user)
                .then(function (resolve) {
                    sessionService.reg=false
                },
                function (reject) {
                    errorHandler(reject)
                })
        }

        function errorHandler(errors) {

            for (var i in errors) {
                var err = errors[i][0]
                console.log(err)
                if (err == "User already exists") {
                    $scope.userErr = { error: true, message: "Username already exists" }
                    if (err == "Email already exists") { $scope.mailErr = "Email already exists" }
                }
            }
        }
    }


})();
