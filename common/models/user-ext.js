'use strict';
var _ = require('underscore');
module.exports = function(UserExt) {
UserExt.getRolesById = function (id, cb) {
    UserExt.getApp(function (err, app) {
      if (err) throw err;
      var RoleMapping = app.models.RoleMapping;
      var Role = app.models.Role;
      RoleMapping.find({ where : { principalId: id }}, function (err, roleMappings) {
        var roleIds = _.uniq(roleMappings
          .map(function (roleMapping) {
            return roleMapping.roleId;
          }));
        var conditions = roleIds.map(function (roleId) {
          return { id: roleId };
        });
        Role.find({ where: { or: conditions}}, function (err, roles) {
          if (err) throw err;
          var roleNames = roles.map(function(role) {
            return role.name;
          });
          cb(null, roleNames);
        });
      });
    });
  };
  UserExt.remoteMethod('getRolesById', {
    http: { path: '/getRolesById', verb: 'get' },
    accepts: {arg: 'id', type: 'number'},
    returns: { arg: 'roles', type: 'Object', root: false }
  });
}

