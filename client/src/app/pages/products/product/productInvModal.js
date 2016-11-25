/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.product.products')
    .controller('productInvModalCtrl', productInvModalCtrl)
    .factory('$productInvModal', productInvModal)

  function productInvModal($uibModal) {
    var open = function (size, item, rowId, newItem) {
      return $uibModal.open({
        controller: 'productInvModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/products/product/productInvModal.html',
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

  function productInvModalCtrl($scope, $uibModalInstance, toastr, items) {
    var vm = this
    $scope.label = {}
    $scope.newLabel = {

    }
    $scope.productInvCollection = [
      { id: 1, label: 8219999, invoice: "13" },
      { id: 2, label: 8219998, invoice: "15" },
      { id: 3, label: 8219997, invoice: "16" },
      { id: 4, label: 8219996, invoice: "13" },
    ]
    vm.content = items
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function () {
      vm.confirm();
    }

    $scope.submitLabel = function (event) {

      if (event.keyCode == 13) {
        var valid = false
        if ($scope.newLabel.hasOwnProperty('label') && $scope.newLabel.label !== null) {
          toastr.info('Enter')
          valid = true
        } else {
          toastr.error('Label required')
        }
        if ($scope.newLabel.hasOwnProperty('invoice') && $scope.newLabel.invoice !== null) {
          valid = valid & true
        } else {
          toastr.error('Invoice number required')
          valid = false
        }
        if (valid) {
          toastr.success('success')
        }
      }

    }
  }

})();