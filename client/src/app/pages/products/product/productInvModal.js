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
    var open = function (size, item, rowId) {
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



  function productInvModalCtrl($scope, $uibModalInstance, ProductItem, toastr, items, $timeout, $commonModal) {
    var vm = this
    $scope.label = {}
    $scope.newLabel = {
      invoice: null
    }

    vm.content = items
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function () {
      vm.confirm();
    }
    $scope.productInvCollection = ProductItem.find({ filter: { where: { productId: items.item.id } } })

    $scope.focusedItem = null

    $scope.focusedItemChange = function (item) {
      $scope.focusedItem = item
    }

    $scope.$on('bar-code-scan-event', function (event, parameters) {
      if ($scope.focusedItem && $scope.focusedItem !== 'label') {
        $scope.newLabel[$scope.focusedItem] = parseInt(("" + $scope.newLabel[$scope.focusedItem]).replace(parameters.barCodeValue, ""))
      }
      $scope.newLabel.label = parseInt(parameters.barCodeValue)
      addLabel()

      console.info('Scan detected, bar code is : ', parameters.barCodeValue);
    })


    $scope.submitLabel = function (event) {

      if (event.keyCode == 13) {
        addLabel()
      }

    }

    $scope.deleteItem = function (item) {
            var rowId = $scope.productInvCollection.indexOf(item)
            var message = "Do you really want to delete product " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                ProductItem.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find product with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.productInvCollection.splice(rowId, 1)
                        }
                        toastr.success('Product ' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        };


    function addLabel() {
      var valid = false
      if ($scope.newLabel.hasOwnProperty('label') && $scope.newLabel.label !== null && $scope.newLabel.label !== "") {
        valid = true
      } else {
        valid = false
        toastr.error('Label required')
      }
      if ($scope.newLabel.hasOwnProperty('invoice') && $scope.newLabel.invoice !== null && !isNaN(parseInt($scope.newLabel.invoice))) {
        valid = valid & true
      } else {
        valid = false
        toastr.error('Invoice number required')
      }
      if (valid) {
        ProductItem.create({ label: $scope.newLabel.label, invoice: $scope.newLabel.invoice, productId: items.item.id },
          function (success) {
            toastr.success('Label addedd')
            $scope.productInvCollection = ProductItem.find({ filter: { where: { productId: items.item.id } } })
          },
          function (error) {
            if (error.data.error.code == "ER_DUP_ENTRY") {
              toastr.error('Duplicated Label!')
            } else {
              toastr.error(error.data.error.message)
            }
          }
        )
      }
      $scope.newLabel.label = null
    }
  }

})();