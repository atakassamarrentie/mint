/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.userMgmt.users')
    .controller('usersModalCtrl', usersModalCtrl)
    .factory('$userModal', userModalFactory)
    

  function userModalFactory($uibModal) {
    var open = function (size, title, message, id, rowId) {
      return $uibModal.open({
        controller: 'usersModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/userManagement/users/usersModal.html',
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
  function usersModalCtrl($scope, $uibModalInstance, items) {
    var vm = this
    vm.content = items
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function() {
      vm.confirm();
    }
  }
})();