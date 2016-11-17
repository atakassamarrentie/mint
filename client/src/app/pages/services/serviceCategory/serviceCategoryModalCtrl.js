/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.service.serviceCategory')
    .controller('ServiceCategoryModalCtrl', ServiceCategoryModalCtrl)
    .factory('$myModal', myModalFactory)
    

  function myModalFactory($uibModal) {
    var open = function (size, title, message, id, rowId) {
      return $uibModal.open({
        controller: 'ServiceCategoryModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/services/serviceCategory/serviceCategoryModal.html',
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
  function ServiceCategoryModalCtrl($rootScope, $scope, $uibModalInstance, items) {
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