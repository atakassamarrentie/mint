/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.client')
    .controller('clientPropModalCtrl', clientPropModalCtrl)
    .factory('$myModal', myModalFactory)
    .controller('clientModalCtrl', clientModalCtrl)
    .factory('$clientPropModal', clientPorpModal)



  function myModalFactory($uibModal) {
    var open = function (size, title, message, id, rowId) {
      return $uibModal.open({
        controller: 'clientModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/clients/clientsModal.html',
        size: size,
        backdrop: 'static',
        resolve: {
          items: function () {
            return {
              message: message,
              title: title,
              id: id,
              rowId: rowId
            }
          }
        }
      });
    };
    return {
      open: open
    }
  }

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



  /** @ngInject */
  function clientModalCtrl($rootScope, $scope, $uibModalInstance, items) {
    var vm = this
    vm.content = items
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function (id, rowId) {
      $rootScope.confirmedDelete(id, rowId)
      vm.confirm();
    }
  }

  function clientPropModalCtrl($rootScope, $scope, Client, $uibModalInstance, items) {
    var vm = this
    $scope.editable = items.newItem
    $scope.newClient = {}
    $scope.submitClient = function (client) {
      if (client.hasOwnProperty('id')) {
        Client.upsert(client.id, client, function(res){vm.done()})
      } else {
        Client.create(client, function(res){vm.done()})
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