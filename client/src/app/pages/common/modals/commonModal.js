/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin')
    .controller('commonModalCtrl', commonModalCtrl)
    .factory('$commonModal', commonModalFactory)
    

  function commonModalFactory($uibModal) {
    var open = function (size, title, message, id, rowId) {
/*        console.log("size: ", size)
        console.log("title: ", title)
        console.log("message: ", message)
        console.log("id: ", id)
        console.log("rowId: ", rowId)*/
      return $uibModal.open({
        controller: 'commonModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/common/modals/commonModal.html',
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
  function commonModalCtrl($scope, $uibModalInstance, items) {
    console.log(items)
    var vm = this
    vm.content = items
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function() {
      vm.confirm();
    }
  }
})();