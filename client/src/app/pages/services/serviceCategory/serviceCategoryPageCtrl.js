/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.service.serviceCategory')
        .controller('serviceCategoryPageCtrl', serviceCategoryPageCtrl)


    /** @ngInject */
    function serviceCategoryPageCtrl($rootScope, $scope, Service, Service_category, $filter, $myModal, toastr, $q) {
        $scope.serviceCategoryCollection = Service_category.find()
        $scope.displayedCollection = [].concat($scope.serviceCategoryCollection);

        $scope.checkName = function (data, id) {
            console.log(data, id)
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Service Category Name cannot be empty');
                d.reject('')
            } else {
                Service_category.find({ filter: { where: { and: [{ category_name: data }, { id: { neq: id } }] } } }, function (res) {
                    console.log(res.length)
                    if (res.length !== 0) {
                        toastr.error('Service Category Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                })
            }
            return d.promise
        }

        $scope.addNewItem = function (data) {
            console.log(data)
            Service_category.create(data, function (result) {
                
                toastr.success('New service category has been added successfully with id ' + result.id);
                $scope.newService = angular.copy({})
                $scope.serviceCategoryCollection = Service_category.find()
            })
        }

        $scope.updateServiceCategory = function (data, id) {
            data.id = id
            Service_category.upsert(data, function (result) {
                console.log(result)
                toastr.success('Service Category ' + id + ' has been updated successfully');
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.serviceCategoryCollection.indexOf(item)
            var message = "Do you really want to delete service category " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            $myModal.open('sm', title, message, item.id, rowId)
        }

        $rootScope.confirmedDelete = function (id, itemRow) {
            Service_category.destroyById({ id: id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find service category with id ' + id);
                } else {
                    if (itemRow !== -1) {
                        $scope.serviceCategoryCollection.splice(itemRow, 1)
                    }
                    toastr.success('Service category' + id + ' has been deleted successfully');
                }
            })
        }

    }
})();
