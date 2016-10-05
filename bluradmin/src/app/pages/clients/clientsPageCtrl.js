/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.client')
        .controller('clientPageCtrl', clientPageCtrl)


    /** @ngInject */
    function clientPageCtrl($rootScope, $scope, Client, $filter, $myModal, toastr, $q) {
        $scope.clientCollection = Client.find()
        $scope.displayedCollection = [].concat($scope.clientCollection);


        $scope.addNewItem = function (data) {
            Client.create(data, function (result) {
                console.log(result)
                toastr.success('New client has been added successfully with id ' + result.id);
                $scope.newProduct = angular.copy({})
                $scope.clientCollection = Client.find()
            })


        }

        $scope.updateClient = function (data, id) {
            console.log("update")
            data.id = id
            Client.upsert(data, function (result) {
                console.log(result)
                toastr.success('Client ' + id + ' has been updated successfully');
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.clientCollection.indexOf(item)
            var message = "Do you really want to delete client " + item.first_name + "," + item.last_name + "  (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };

        $rootScope.confirmedDelete = function (id, itemRow) {
            Client.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find product with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.clientCollection.splice(itemRow, 1)
                    }
                    toastr.success('Product ' + id + ' has been deleted successfully');
                }
            })
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }
    }
})();
