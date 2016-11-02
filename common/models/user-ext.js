'use strict';
var _ = require('underscore');
module.exports = function (UserExt) {

  UserExt.getRolesById = function (id, cb) {


    var RoleMapping = UserExt.app.models.RoleMapping;
    var Role = UserExt.app.models.Role;
    RoleMapping.find({ where: { principalId: id } })
      .then(function (roleMappings) {
        var roleIds = _.uniq(roleMappings
          .map(function (roleMapping) {
            return roleMapping.roleId;
          }));
        var conditions = roleIds.map(function (roleId) {
          return { id: roleId };
        });
        Role.find({ where: { or: conditions } }, function (err, roles) {
          if (err) cb(err);
          var roleNames = roles.map(function (role) {
            return role.name;
          });
          cb(null, roleNames);
        });
      });

  };

  UserExt.setRoles = function (id, newRoles, cb) {
    var RoleMapping = UserExt.app.models.RoleMapping;
    var Role = UserExt.app.models.Role;
    RoleMapping.find({ where: { principalId: id } })
      .then(function (roleMappings) {
        var roleIds = _.uniq(roleMappings
          .map(function (roleMapping) {
            return roleMapping.roleId;
          }));
        var conditions = roleIds.map(function (roleId) {
          return { id: roleId };
        });
        Role.find({ where: { or: conditions } }, function (err, roles) {
          if (err) cb(err);
          var oldRoleIds = roles.map(function (role) {
            return role.id;
          });
          if (!roleMappings.length) {oldRoleIds = []}
          var deleteRoles = oldRoleIds.filter(x => newRoles.roles.indexOf(x) < 0)
          var createRoles = newRoles.roles.filter(x => oldRoleIds.indexOf(x) < 0)
          var createQuery = []
          createRoles.forEach(function (item) {
            var temp = {}
            temp.principalType = "USER"
            temp.principalId = id
            temp.roleId = item
            createQuery.push(temp)
          })
          RoleMapping.create(createQuery)

          deleteRoles.forEach(function (item) {
        
            RoleMapping.destroyAll({and: [ {principalId: id}, {roleId: item}, {principalType: "USER"}]},function(err, res){
              if (err) { cb (err)}
            })
          })

          cb(null, true);
        });
      });


  }


  UserExt.remoteMethod('getRolesById', {
    http: { path: '/getRolesById', verb: 'get' },
    accepts: { arg: 'id', type: 'number' },
    returns: { arg: 'roles', type: 'Object', root: false }
  });

  UserExt.remoteMethod('setRoles', {
    http: { path: '/setRoles', verb: 'post' },
    accepts: [
      { arg: 'id', type: 'number', required: true },
      { arg: 'newRoles', type: 'object', required: true }
    ],
    returns: { arg: 'result', type: 'boolean', root: true }
  })
}

