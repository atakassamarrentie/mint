/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.roles')
        .controller('rolesPageCtrl', rolesPageCtrl)


    /** @ngInject */
    function rolesPageCtrl($rootScope, $scope, $roleModal, UserExt, sessionService, Role, $filter, toastr, $q) {
        $scope.writeAccess = sessionService.role.indexOf('users_write') > -1 || sessionService.role.indexOf('admin') > -1
        $scope.allRoles = []
        UserExt.find({ filter: { include: 'roles' } }, function (result) {
            var tempArray = []
            result.forEach(function (item) {
                item['roleIds'] = []
                item.roles.forEach(function (role) {
                    item.roleIds.push(role.id)
                })
                tempArray.push(item)
            })
            $scope.userCollection = (tempArray)
        })
        $scope.displayedCollection = [].concat($scope.userCollection);
        Role.find(function (result) {
            result.forEach(function (role) {
                $scope.allRoles.push({ id: role.id, name: role.name })
            })

        })
        //$scope.allRoles = [{id: 1}, {id: 2}]

        $scope.showRoles = function (roles) {

            var selected = []

            angular.forEach($scope.allRoles, function (s) {
                if (roles.indexOf(s.id) >= 0) {
                    selected.push(s.name);
                }
            });

            return selected.length ? selected.join(', ') : 'none'

        }

        $scope.updateClient = function (data, id) {
            UserExt.setRoles({ id: id }, { newRoles: data })
        }

        $scope.editRoles = function (item) {
            var rowId = $scope.userCollection.indexOf(item)
            var dialog = $roleModal.open('md', item, rowId)
            dialog.result.then(function () {
                UserExt.find({ filter: { include: 'roles' } }, function (result) {
                    var tempArray = []
                    result.forEach(function (item) {
                        item['roleIds'] = []
                        item.roles.forEach(function (role) {
                            item.roleIds.push(role.id)
                        })
                        tempArray.push(item)
                    })
                    $scope.userCollection = (tempArray)
                    $scope.displayedCollection = [].concat($scope.userCollection);
                })

            })
        }

        function myIndexOf(o) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].x == o.x && arr[i].y == o.y) {
                    return i;
                }
            }
            return -1;
        }
    }
})();