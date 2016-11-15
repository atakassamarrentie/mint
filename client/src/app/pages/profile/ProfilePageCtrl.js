/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl)


  /** @ngInject */
  function ProfilePageCtrl($scope, fileReader, $filter, $uibModal, $stateParams, UserExt, sessionService, toastr) {
    
    $scope.sessionService = sessionService
    if ($stateParams.hasOwnProperty('userId') && $stateParams.userId !== null) {
      $scope.userId = $stateParams.userId
      if ($scope.userId == sessionService.user.id) {
        $scope.owner = true
      } else {
        $scope.owner = false
      }
    } else {
      $scope.userId = sessionService.user.id
      $scope.owner = true
    }



    UserExt.find({ filter: { where: { id: $scope.userId } } }, function (res) {
      $scope.user = res[0]
      $scope.avatar = res[0].firstName + ' ' + res[0].lastName
    })

    $scope.confirmPassword = function () {
      $scope.test = $scope.newPassword + '-' + $scope.newPasswordConfirm
      if ($scope.newPassword == $scope.newPasswordConfirm) {
        $scope.passMatch = true
        $scope.userPassword.newPasswordConfirm.$setValidity('confirmed', true)
      } else {
        $scope.passMatch = false
        $scope.userPassword.newPasswordConfirm.$setValidity('confirmed', false)
      }
    }

    $scope.changePassword = function () {
      console.log('pass', $scope.oldPassword)
      UserExt.changePassword({ id: $scope.userId }, { oldPassword: $scope.oldPassword, newPassword: $scope.newPassword },
        function (success) {
          toastr.success('Password has been changed');
          $scope.wrongOldPassword = false
        },
        function (error) {
          if (error.data.error.code == 'ICR_PASSWORD') {
            $scope.wrongOldPassword = true
          }
          console.log(error)

        }
      )
    }

    $scope.unameValid = function () {

      $scope.userErr = { message: "" }
      var username = $scope.user.username
      if (username) {
        $scope.userInfo.username.$setValidity("custom", false)
        if (username.length >= 6) {
          $scope.pending = true
          UserExt.isUsernameExists({ username: username, id: $scope.user.id }, function (res) {
            console.log(res)
            if (res.result) {
              $scope.userErr = { error: true, message: "Username already exists" }
            } else {
              $scope.userErr = { error: false, message: "Valid username" }
            }
            $scope.pending = false
            $scope.userInfo.username.$setValidity("custom", !$scope.userErr.error)
          })
        } else {
          $scope.userErr = { error: true, message: "Username must be at least 6 characters" }
        }
        $scope.userInfo.username.$setValidity("custom", !$scope.userErr.error)
      }
    }

    $scope.mailValid = function () {
      var email = $scope.user.email
      $scope.mailErr = { message: "" }
      if (email) {
        $scope.userInfo.email.$setValidity("custom", false)
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
          $scope.pending2 = true
          UserExt.isEmailExists({ email: email, id: $scope.user.id }, function (res) {
            if (res.result) {
              $scope.mailErr = { error: true, message: "Email already exists" }
            } else {
              $scope.mailErr = { error: false, message: "Valid email" }
            }
            $scope.pending2 = false
            $scope.userInfo.email.$setValidity("custom", !$scope.mailErr.error)
          })

        } else {
          $scope.mailErr = { error: true, message: "Not a valid email" }
        }
        $scope.userInfo.email.$setValidity("custom", !$scope.mailErr.error)
      }
    }

    $scope.updateUser = function () {
      console.log($scope.user)
      
      UserExt.updateAll({where: { id: $scope.user.id } }, $scope.user, 
      function(success) {
        toastr.success('User has been updated successfully')
      },
      function(error) {
        console.log(error)
        toastr.error(error)
      } )
    }

  }



})();
