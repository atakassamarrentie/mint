/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('BaSidebarCtrl', BaSidebarCtrl);

  /** @ngInject */
  function BaSidebarCtrl($rootScope, $scope, baSidebarService, UserExt, Role, sessionService) {
    UserExt.getRolesById({id: sessionService.user.id}, function(result){
      $scope.menuItems = baSidebarService.getMenuItems(result.roles);
      $rootScope.defaultMenuItem = $scope.menuItems[0] 
      $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
    })
    
    
    

    $scope.hoverItem = function ($event) {
      $scope.showHoverElem = true;
      $scope.hoverElemHeight =  $event.currentTarget.clientHeight;
      var menuTopValue = 66;
      $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
    };

    $scope.$on('$stateChangeSuccess', function () {
      if (baSidebarService.canSidebarBeHidden()) {
        baSidebarService.setMenuCollapsed(true);
      }
    });
  }
})();