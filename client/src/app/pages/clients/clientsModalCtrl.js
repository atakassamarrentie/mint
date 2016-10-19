/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.client')
    .controller('clientModalCtrl', clientModalCtrl)
    .factory('$myModal', myModalFactory)
    

  function myModalFactory($uibModal) {
    var open = function (size, title, message, id, rowId) {
      return $uibModal.open({
        controller: 'clientModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/clients/clientsModal.html',
        size: size,
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

  /** @ngInject */
  function clientModalCtrl($rootScope, $scope, $uibModalInstance, items) {
    var vm = this
    vm.content = items
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function(id, rowId) {
      $rootScope.confirmedDelete(id, rowId)
      vm.confirm();
    }
  }
})();