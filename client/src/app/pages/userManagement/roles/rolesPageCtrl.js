/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userMgmt.users')
        .controller('rolesPageCtrl', rolesPageCtrl)


    /** @ngInject */
    function rolesPageCtrl($rootScope, $scope, UserExt, Role, $filter, $myModal, toastr, $q) {

        $scope.userCollection = UserExt.find({filter: {include: 'roles'}})
        $scope.displayedCollection = [].concat($scope.userCollection);
        //$scope.allRoles = Role.find()
        $scope.allRoles = [{id: 1}, {id: 2}]

        $scope.showRoles = function(roles) {
            
            var userRoleIds = []
            roles.forEach(function(item){
                userRoleIds.push(item.id)
            })
            var roleArr = []
            $scope.allRoles.forEach(function(s){
                roleArr.push(s.id)
            })
            
            return roleArr
        }
    }
})();