/**
 * @author v.lugovsky
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.login', ['ui.router'])
    .controller('loginCtrl', loginCtrl)
    .service('sessionService', sessionService)
    .config(function (LoopBackResourceProvider) {

      // Use a custom auth header instead of the default 'Authorization'
      LoopBackResourceProvider.setAuthHeader('X-Access-Token');

      // Change the URL where to access the LoopBack REST API server
      LoopBackResourceProvider.setUrlBase('http://127.0.0.1:4000/api');

    })


  function loginCtrl($cookies, $scope, $state, sessionService, UserExt) {
    $scope.loginState = true
    sessionService.token = sessionService.token || $cookies.get('token')
    sessionService.user = $cookies.getObject('user') || sessionService.user
    $scope.sessionService = sessionService
    $scope.sessionService.token = $scope.sessionService.token || $cookies.get('token')
    if (!sessionService.role && sessionService.user) {
      UserExt.getRolesById({ id: sessionService.user.id }, function (result) {
        sessionService.role = result.roles
        $state.go('usermgmt.users')
      })
    } else {
      $state.go('usermgmt.users')
    }



  }

  function sessionService($cookies, $state, $http, UserExt) {
    var self = this

    self.logout = function () {
      UserExt.logout().$promise.then(
        function (res) {
          $cookies.remove('token')
          $cookies.remove('user')
          self.user = null
          self.token = null
        },
        function (err) { self.error = err }
      )
    }

    self.login = function (user) {

      UserExt.login({ username: user.name, password: user.password }).$promise.then(
        function (res) {
          self.response = res
          self.error = null
          self.token = res.id
          self.user = res.user
          UserExt.getRolesById({ id: res.user.id }, function (result) {
            self.role = result.roles
            console.log(result.roles)
            $cookies.put('token', res.id)
            $cookies.putObject('user', res.user)
            $state.go('client')
          })


        },
        function (err) {
          self.error = err
          self.response = null


        }
      )
    }
  }
})();