/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.client')
    .controller('clientPropModalCtrl', clientPropModalCtrl)
    .factory('$clientPropModal', clientPorpModal)

  function clientPorpModal($uibModal) {
    var open = function (size, item, rowId, newItem) {
      return $uibModal.open({
        controller: 'clientPropModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/clients/clientsPropModal.html',
        size: size,
        backdrop: 'static',
        resolve: {
          items: function () {
            return {
              item: item,
              rowId: rowId,
              newItem: newItem
            }
          }
        }
      });
    };
    return {
      open: open
    }
  }

  function clientPropModalCtrl($rootScope, $scope, Client, $uibModalInstance, toastr, items) {
    var vm = this
    $scope.editable = items.newItem
    $scope.newClient = {}
    $scope.submitClient = function (client) {
      if (client.hasOwnProperty('id')) {
        Client.upsert(client.id, client,
          function (res) { vm.done() },
          function (err) { toastr.error(err.data.error.message) }
        )
      } else {
        Client.create(client,
          function (res) { vm.done() },
          function (err) { toastr.error(err.data.error.message) }
        )
      }
    }

    vm.content = items
    $scope.item = vm.content.item
    if ($scope.item) {
      if ($scope.item.birth) $scope.item.birth = new Date($scope.item.birth)
      if ($scope.item.startDate) $scope.item.startDate = new Date($scope.item.startDate)
      if ($scope.item.nextFamEvDate) $scope.item.nextFamEvDate = new Date($scope.item.nextFamEvDate)
    }
    angular.copy($scope.item, $scope.newClient)
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function () {
      vm.confirm();
    }
  }


})();