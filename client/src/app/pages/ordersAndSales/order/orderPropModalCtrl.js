/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ordersAndSales.orders')
    .controller('orderPropModalCtrl', orderPropModalCtrl)
    .factory('$orderPropModal', orderPorpModal)

  function orderPorpModal($uibModal) {
    var open = function (size, item, rowId, newItem) {
      return $uibModal.open({
        controller: 'orderPropModalCtrl',
        controllerAs: 'vm',
        animation: true,
        templateUrl: 'app/pages/ordersAndSales/order/orderPropModal.html',
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

  function orderPropModalCtrl($rootScope, $scope, Partners, Payment, Product, Product_category, $uibModalInstance, toastr, items) {
    var vm = this

    vm.content = items
    $scope.item = vm.content.item
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function () {
      vm.confirm();
    }

    $scope.partners = Partners.find()
    $scope.payments = Payment.find()
    $scope.products = Product.find()
    $scope.filteredProducts = $scope.products
    $scope.productCategory = {}
    $scope.allCategory = {}

    Product_category.find({}, function (res) {
      $scope.allCategory[0] = { id: '', category_name: '-- Clear --' }
      res.forEach(function (item) {
        $scope.allCategory[item.id] = item
      })
      $scope.productCategory = $scope.allCategory
    })

    $scope.newOrder = {
      order_date: new Date(),
      expected_date: new Date()
    }

    $scope.productChanged = function () {
      console.log($scope.newOrder.product)
      $scope.newOrder.category = $scope.newOrder.product.productCategoryId
    }

    $scope.productCategoryChanged = function () {
      if ($scope.newOrder.category) {
        $scope.filteredProducts = $scope.products.filter(function (item) {
          return item.productCategoryId == $scope.newOrder.category
        })
      } else {
        $scope.filteredProducts = $scope.products
      }
    }
  }


})();