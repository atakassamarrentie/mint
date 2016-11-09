/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.service.services')
        .controller('servicePageCtrl', servicePageCtrl)


    /** @ngInject */
    function servicePageCtrl($rootScope, $scope, Service, Service_category, $filter, $myModal, toastr, $q) {
        $scope.newService = {}
        $scope.serviceCategory = {}

        $scope.serviceCollection = Service.find({ filter: { include: 'serviceCategory' } }, function (result) {
            $scope.serviceCollection.forEach(function (item, index) {
                $scope.serviceCollection[index].fulfilled = item.reorder >= item.inventory
            })
        })

        $scope.displayedCollection = [].concat($scope.serviceCollection);

        Service_category.find({}, function (res) {
            res.forEach(function (item, index, array) {
                $scope.serviceCategory[item.id] = item
            })
        })

        $scope.addNewItem = function (data) {
            data.inventory = 0
            Service.create(data, function (result) {

                toastr.success('New service has been added successfully with id ' + result.id);


                $scope.serviceCollection = Service.find({ filter: { include: 'serviceCategory' } }, function (result) {
                    $scope.serviceCollection.forEach(function (item, index) {
                        $scope.serviceCollection[index].fulfilled = item.reorder >= item.inventory
                    })
                })

                $scope.displayedCollection = [].concat($scope.serviceCollection);

            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.serviceCollection.indexOf(item)
            var message = "Do you really want to delete service " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        };

        $scope.updateService = function (data, id) {
            data.id = id
            Service.upsert(data, function (result) {
                toastr.success('Service ' + id + ' has been updated successfully');
            })
            $scope.displayedCollection.forEach(function (item, index) {
                if (item.id == id){
                    $scope.displayedCollection[index].fulfilled = data.reorder >= data.inventory
                    console.log()
                }
                
            })
        }

        $scope.showCategory = function (catId) {
            return ($scope.serviceCategory[catId]) ? $scope.serviceCategory[catId].category_name : ''
        }

        $scope.checkEmpty = function (data, name) {
            if (!data) { toastr.error(name + "is a required field"); return "" }
        }

        $scope.checkName = function (data, id) {
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Service Name cannot be empty');
                d.reject('')
            } else {
                Service.find({ filter: { where: { and: [{ name: data }, { id: { neq: id } }] } } }, function (res) {
                    if (res.length !== 0) {
                        toastr.error('Service Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                })
            }
            return d.promise
        }

        $rootScope.confirmedDelete = function (id, itemRow) {
            Service.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find service with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.serviceCollection.splice(itemRow, 1)
                    }
                    toastr.success('Service ' + id + ' has been deleted successfully');
                }
            })
        }

    }
})();
