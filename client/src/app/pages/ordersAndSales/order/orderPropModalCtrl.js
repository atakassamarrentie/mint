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
    var open = function (size, id) {
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
              id: id,
            }
          }
        }
      });
    };
    return {
      open: open
    }
  }

  function orderPropModalCtrl(sessionService, $scope, Order, Partners, SubOrder, Payment, Product, Product_category, $uibModalInstance, $commonModal, toastr, items) {
    var vm = this


    // Initialize data ------------------------

    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.content = items;
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
      res.forEach(function (item) {
        $scope.allCategory[item.id] = item
      })
      $scope.productCategory = $scope.allCategory
    })

    resetProduct()
    updateTable()

    // END -------------------------------------

    $scope.closeProduct = function () {
      resetProduct()
      $scope.addProduct = false
    }

    $scope.resetProduct = function () {
      resetProduct()
    }



    // Local functions -------------------------

    function resetProduct() {
      $scope.newProduct = {
        quantity: 1,
        customPrice: false,
        orderId: vm.content.id
      }

    }

    function updateTable() {
      $scope.subOrdersCollection = SubOrder.find({ filter: { where: { orderId: vm.content.id } } }, function (success) {
        $scope.grandTotal = $scope.totalQuantity = 0
        success.forEach(function (subOrder) {
          $scope.grandTotal += subOrder.total
          $scope.totalQuantity += subOrder.quantity
        })
      })
      $scope.displayedSubOrdersCollection = [].concat($scope.subOrdersCollection);
    }



    $scope.productChanged = function () {
      $scope.newProduct.category = $scope.newProduct.product.productCategoryId
      $scope.newProduct.sell_price = $scope.newProduct.product.sell_price
      $scope.calcOrder()
    }

    $scope.productCategoryChanged = function () {
      if ($scope.newProduct.category) {
        $scope.filteredProducts = $scope.products.filter(function (item) {
          return item.productCategoryId == $scope.newProduct.category
        })
      } else {
        $scope.filteredProducts = $scope.products
      }
      $scope.newProduct.product = null
      $scope.newProduct.sell_price = null
      $scope.newProduct.total = null

    }

    $scope.calcOrder = function () {
      $scope.newProduct.total = null
      $scope.newProduct.total = $scope.newProduct.sell_price * $scope.newProduct.quantity
    }

    $scope.switchChanged = function () {
      $scope.newProduct.sell_price = $scope.newProduct.product.sell_price
      $scope.calcOrder()
    }

    $scope.saveProduct = function () {

      var newProduct = $scope.newProduct

      newProduct.productName = newProduct.product.name
      newProduct.productId = newProduct.product.id
      newProduct.price = newProduct.sell_price
      newProduct.category = $scope.allCategory[newProduct.category].category_name
      newProduct.total = newProduct.price * newProduct.quantity
      SubOrder.create(newProduct
        , function (success) {
          toastr.success('success')
          resetProduct()
          $scope.addProduct = false
          updateTable()
        }
        , function (error) {
          toastr.error(error.data.error.message)
          resetProduct()
        })
    }

    $scope.deleteProduct = function (item) {
      var rowId = $scope.subOrdersCollection.indexOf(item)
      var message = "Do you really want to delete product " + item.product_name + " (with id " + item.id + ")"
      var title = "Confirm"
      var dialog = $commonModal.open('sm', title, message, item.id, rowId)
      dialog.result.then(function () {
        SubOrder.destroyById({ id: item.id }, function (result) {
          if (result.count == 0) {
            toastr.error('Error: Cannot find product with id ' + item.id);
          } else {
            if (rowId !== -1) {
              updateTable()
            }
            toastr.success('Product ' + item.id + ' has been deleted successfully');
          }
        }, function (err) {
          toastr.error(err.data.error.message)
        })
      })
    };

    // END -------------------------------------



    /*var vm = this
    $scope.newProduct = {
      order_date: new Date(),
      expected_date: new Date(),
      quantity: 1,
      customPrice: false
    }
    vm.content = items
    console.log(vm.content)

    if (vm.content.id == 'new') {
      $scope.isNew = true
    } else {
      $scope.isNew = false
      $scope.newProduct.orderId = vm.content.id
      $scope.subOrdersCollection = SubOrder.find({ filter: { where: { orderId: $scope.newProduct.orderId } } })
    }

    $scope.item = vm.content.item
    vm.confirm = $uibModalInstance.close;
    vm.cancel = $uibModalInstance.dismiss;
    vm.done = function () {
      vm.confirm();
    }

    $scope.prodHeadMessage = "Add new Product"


    $scope.displayedSubOrdersCollection = [].concat($scope.subOrdersCollection);

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



    $scope.productChanged = function () {
      $scope.newProduct.category = $scope.newProduct.product.productCategoryId
      $scope.newProduct.sell_price = $scope.newProduct.product.sell_price
      $scope.calcOrder()
    }

    $scope.productCategoryChanged = function () {
      if ($scope.newProduct.category) {
        $scope.filteredProducts = $scope.products.filter(function (item) {
          return item.productCategoryId == $scope.newProduct.category
        })
      } else {
        $scope.filteredProducts = $scope.products
      }
      $scope.newProduct.product = null
      $scope.newProduct.sell_price = null
      $scope.newProduct.total = null

    }

    $scope.calcOrder = function () {
      $scope.newProduct.total = null
      $scope.newProduct.total = $scope.newProduct.sell_price * $scope.newProduct.quantity
    }

    $scope.switchChanged = function () {
      $scope.newProduct.sell_price = $scope.newProduct.product.sell_price
      $scope.calcOrder()
    }

    $scope.addProduct = function () {

      var newProduct = $scope.newProduct
      console.log(newProduct)
      if (newProduct.product && newProduct.category && newProduct.quantity && newProduct.sell_price && newProduct.total) {
        newProduct.productName = newProduct.product.name
        newProduct.productId = newProduct.product.id
        newProduct.price = newProduct.sell_price
        newProduct.orderId = $scope.newProduct.orderId
        SubOrder.create(newProduct
          , function (success) {
            toastr.success('success')
            $scope.resetProduct()
            $scope.subOrdersCollection = SubOrder.find({ filter: { where: { orderId: $scope.newProduct.orderId } } })
            $scope.displayedSubOrdersCollection = [].concat($scope.subOrdersCollection);
          }
          , function (error) {
            toastr.error(error.data.error.message)
            $scope.resetProduct()
          })
      } else {
        toastr.error('Please fill out all the fields first!')
      }

    }

    $scope.resetProduct = function () {
      $scope.newProduct.product = null
      $scope.newProduct.category = null
      $scope.newProduct.quantity = 1
      $scope.newProduct.sell_price = null
      $scope.newProduct.total = null
      $scope.newProduct.customPrice = false
    }


    vm.save = function () {
      console.log()
      var v = true
      if (!$scope.newProduct.partner) {
        toastr.error('Partner is a required field!')
        v = false
      }
      if (!$scope.newProduct.payment) {
        toastr.error('Payment is a required field!')
        v = false
      }
      if (!$scope.newProduct.order_date) {
        toastr.error('Order Date is a required field!')
        v = false
      }
      if (!$scope.newProduct.expected_date) {
        toastr.error('Expected Date is a required field!')
        v = false
      }
      if (v) {
        console.log($scope.newProduct)
        Order.create({
          order_date: $scope.newProduct.order_date,
          expected_date: $scope.newProduct.expected_date,
          description: $scope.newProduct.description,
          completed: false,
          username: sessionService.user.username,
          partnerName: $scope.newProduct.partner.name,
          paymentId: $scope.newProduct.payment,
          userId: sessionService.user.id,
          partnerId: $scope.newProduct.partner.id
        }, function (success) {
          $scope.isNew = false
          $scope.newProduct.orderId = success.id
        })
        toastr.success('success')
      }
    }*/

  }


})();