/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.partners')
        .controller('partnersPageCtrl', partnersPageCtrl)


    /** @ngInject */
    function partnersPageCtrl($rootScope, $scope, $filter, sessionService, Partners, $commonModal, toastr, $q) {
        $scope.partnersCollection = Partners.find()
        $scope.displayedCollection = [].concat($scope.partnersCollection);
        $scope.writeAccess = sessionService.role.indexOf('partner_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.addNewItem = function (data) {
            Partners.create(data, function (result) {
                console.log(result)
                toastr.success('New product has been added successfully with id ' + result.id);
                $scope.partnersCollection = Partners.find()
                $scope.displayedCollection = [].concat($scope.partnersCollection);
            }, function (err) {
                toastr.error(err.data.error.message)
            })
            
        }


        $scope.checkName = function (data, id) {
            console.log(data, id)
            var d = $q.defer();
            id = id || ''
            if (!data) {
                toastr.error('Partner Name cannot be empty');
                d.reject('')
            } else {
                Partners.find({ filter: { where: { and: [{ name: data }, { id: { neq: id } }] } } }, function (res) {
                    console.log(res.length)
                    if (res.length !== 0) {
                        toastr.error('Partner Name must be unique');
                        d.reject('')
                    }
                    d.resolve()

                })
            }
            return d.promise
        }

        $scope.updatePartner = function (data, id) {
            data.id = id
            Partners.upsert(data, function (result) {
                console.log(result)
                toastr.success('Partner ' + id + ' has been updated successfully');
            }, function (err){
                toastr.error(err.data.error.message)
            })
        }

        $scope.deleteItem = function (item) {
            var rowId = $scope.partnersCollection.indexOf(item)
            var message = "Do you really want to delete partner " + item.name + " (with id " + item.id + ")"
            var title = "Confirm"
            var dialog = $commonModal.open('sm', title, message, item.id, rowId)
            dialog.result.then(function(){
                Partners.destroyById({ id: item.id }, function (result) {
                if (result.count == 0) {
                    toastr.error('Error: Cannot find partner with id ' + item.id);
                } else {
                    if (rowId !== -1) {
                        $scope.partnersCollection.splice(rowId, 1)
                    }
                    toastr.success('Partner ' + item.id + ' has been deleted successfully');
                }
            }, function (err){
                toastr.error(err.data.error.message)
            })
            })
        };

    
    
    }
})();
