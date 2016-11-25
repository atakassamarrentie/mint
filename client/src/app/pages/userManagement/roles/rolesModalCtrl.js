/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.roles')
        .controller('roleModalCtrl', roleModalCtrl)
        .factory('$roleModal', roleModal)
        .filter('capitalize', function () {
            return function (input, scope) {
                if (input != null)
                    input = input.toLowerCase();
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        });




    function roleModal($uibModal) {
        var open = function (size, roles, rowId) {
            return $uibModal.open({
                controller: 'roleModalCtrl',
                controllerAs: 'vm',
                animation: true,
                templateUrl: 'app/pages/userManagement/roles/roleModal.html',
                size: size,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return {
                            roles: roles,
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



    /** @ngInject */
    function roleModalCtrl($rootScope, Role, UserExt, $scope, $uibModalInstance, items, toastr) {
        $scope.roleList = []
        var vm = this
        vm.content = items
        vm.confirm = $uibModalInstance.close;
        vm.cancel = $uibModalInstance.dismiss;
        vm.done = function (id, rowId) {
            vm.confirm();
        }

        $scope.userRoles = []
        var currentRoles = items.roles.roles
        currentRoles.forEach(function (r) {
            if (r.name !== 'admin') {
                var rs = r.name.split('_')
                if (rs[1] == 'read') {
                    if (indexObject({ model: rs[0], right: 'write' }, $scope.userRoles) == -1) { $scope.userRoles.push({ model: rs[0], right: rs[1] }) }
                }
                if (rs[1] == 'write') {
                    var index = indexObject({ model: rs[0], right: 'read' }, $scope.userRoles)
                    if (index == -1) {
                        $scope.userRoles.push({ model: rs[0], right: rs[1] })
                    } else {
                        $scope.userRoles[index] = ({ model: rs[0], right: rs[1] })
                    }

                }
            }
        })


        Role.find({}, function (result) {

            $scope.allRoles = []
            result.forEach(function (role) {
                $scope.allRoles[role.id] = role.name
                if (role.name !== 'admin') {
                    var roleItem = role.name.split('_')
                    if (
                        (indexObject({ model: roleItem[0], right: 'read' }, $scope.userRoles) == -1) &&
                        (indexObject({ model: roleItem[0], right: 'write' }, $scope.userRoles) == -1) &&
                        (indexObject({ model: roleItem[0] }, $scope.userRoles) == -1)) {
                        $scope.userRoles.push({ model: roleItem[0] })
                    }
                }
            })
        })

        $scope.submitRoles = function (newRoles) {
            var tempRole = []

            $scope.userRoles.forEach(function (newRole) {
                if (newRole.hasOwnProperty('right') && newRole.right !== "") {
                    tempRole.push($scope.allRoles.indexOf(newRole.model + '_' + newRole.right))
                }

            })

            UserExt.setRoles({ id: items.roles.id }, { newRoles: tempRole }
            ,function(success){
                toastr.success('Roles has been set to user')
                vm.confirm()
            }
            ,function(error){
                toastr.error(error.data.error.message)
                vm.cancel()
            })
        }

        function indexObject(o, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].model == o.model && arr[i].right == o.right) {
                    return i;
                }
            }
            return -1;
        }
    }



})();