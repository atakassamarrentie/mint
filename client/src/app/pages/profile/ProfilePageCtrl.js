/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  /** @ngInject */
  function ProfilePageCtrl($scope, fileReader, $filter, $uibModal, $stateParams, UserExt, sessionService) {
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


  }

})();
