(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .provider('baSidebarService', baSidebarServiceProvider);

  /** @ngInject */
  function baSidebarServiceProvider() {
    var staticMenuItems = [];

    this.addStaticItem = function () {
      var menuBuffer = []
      menuBuffer.push.apply(menuBuffer, arguments);
      menuBuffer.forEach(function (item) {
        staticMenuItems.push(item)
      })
    };

    /** @ngInject */
    this.$get = function ($state, layoutSizes) {
      return new _factory();

      function _factory() {
        var isMenuCollapsed = shouldMenuBeCollapsed();

        this.getMenuItems = function (userRoles) {
          
          var states = defineMenuItemStates();
          var menuItems = states.filter(function (item) {
            if (item.abstract) return true
            return item.level == 0 && userRoles.some(function (v) {
              return item.role.indexOf(v) >= 0 || item.role.indexOf('everyone')  >= 0
            });
          });
          var menuBufferItems = []

          menuItems.forEach(function (item) {
            var children = states.filter(function (child) {
              
              return child.level == 1 && child.name.indexOf(item.name) === 0 && userRoles.some(function (v) {
                return child.role.indexOf(v) >= 0
              });;
            });

            item.subMenu = children.length ? children : null;
            if (item.abstract) {
              if (children.length > 0) menuBufferItems.push(item)
            } else {
              menuBufferItems.push(item)
            }
          });
          return menuBufferItems.concat(staticMenuItems);
        };

        this.shouldMenuBeCollapsed = shouldMenuBeCollapsed;
        this.canSidebarBeHidden = canSidebarBeHidden;

        this.setMenuCollapsed = function (isCollapsed) {
          isMenuCollapsed = isCollapsed;
        };

        this.isMenuCollapsed = function () {
          return isMenuCollapsed;
        };

        this.toggleMenuCollapsed = function () {
          isMenuCollapsed = !isMenuCollapsed;
        };

        this.getAllStateRefsRecursive = function (item) {
          var result = [];
          _iterateSubItems(item);
          return result;

          function _iterateSubItems(currentItem) {
            currentItem.subMenu && currentItem.subMenu.forEach(function (subItem) {
              subItem.stateRef && result.push(subItem.stateRef);
              _iterateSubItems(subItem);
            });
          }
        };

        function defineMenuItemStates() {
          return $state.get()
            .filter(function (s) {
              return s.sidebarMeta;
            })
            .map(function (s) {
              var meta = s.sidebarMeta;
              return {
                name: s.name,
                title: s.title,
                level: (s.name.match(/\./g) || []).length,
                order: meta.order,
                icon: meta.icon,
                stateRef: s.name,
                role: s.role || '',
                abstract: s.abstract
              };
            })
            .sort(function (a, b) {
              return (a.level - b.level) * 100 + a.order - b.order;
            });
        }

        function shouldMenuBeCollapsed() {
          return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
        }

        function canSidebarBeHidden() {
          return window.innerWidth <= layoutSizes.resWidthHideSidebar;
        }
      }

    };

  }
})();
