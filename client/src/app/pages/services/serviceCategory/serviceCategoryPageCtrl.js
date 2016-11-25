/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.service.serviceCategory')
        .controller('serviceCategoryPageCtrl', serviceCategoryPageCtrl)


    /** @ngInject */
    function serviceCategoryPageCtrl($rootScope, $scope, Service, sessionService, Service_category, $filter, $commonModal, toastr, $q) {
        $scope.serviceCategoryCollection = Service_category.find()
        $scope.displayedCollection = [].concat($scope.serviceCategoryCollection);
        $scope.writeAccess = sessionService.role.indexOf('services_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.checkName = function (data, id) {
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Service Category Name cannot be empty');
                d.reject('')
            } else {
                Service_category.find({ filter: { where: { and: [{ category_name: data }, { id: { neq: id } }] } } }, function (res) {
                    if (res.length !== 0) {
                        toastr.error('Service Category Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                }, function (err) {
                    toastr.error(err.data.error.message);
                    d.reject('')
                })
            }
            return d.promise
        }

        $scope.addNewItem = function (data) {
            Service_category.create(data, function (result) {
                toastr.success('New service category has been added successfully with id ' + result.id);
                $scope.newService = angular.copy({})
                $scope.serviceCategoryCollection = Service_category.find()
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.updateServiceCategory = function (data, id) {
            data.id = id
            Service_category.upsert(data, function (result) {
                toastr.success('Service Category ' + id + ' has been updated successfully');
            }, function (err) {
                toastr.error(err.data.error.message)
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.serviceCategoryCollection.indexOf(item)
            var message = "Do you really want to delete service category " + item.category_name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function () {
                Service_category.destroyById({ id: item.id }, function (result) {
                    if (result.count == 0) {
                        toastr.error('Error: Cannot find service category with id ' + item.id);
                    } else {
                        if (rowId !== -1) {
                            $scope.serviceCategoryCollection.splice(rowId, 1)
                        }
                        toastr.success('Service category' + item.id + ' has been deleted successfully');
                    }
                }, function (err) {
                    toastr.error(err.data.error.message)
                })
            })
        }
    }
})();
