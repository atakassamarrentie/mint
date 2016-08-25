var loopback = require('loopback');
var ACL = loopback.ACL;

module.exports = function (Model, options) {
    ACL.findOrCreate({where: { and : [{model: Model.definition.name},{principalId: "admin"},{permission: "ALLOW"}]}}, 
        {
            "model": Model.definition.name,
            "property": "*",
            "accessType": "*",
            "principalType": "ROLE",
            "principalId": "admin",
            "permission": "ALLOW"    
        },
        function(err,instance,created){
           if (err) console.log("Error in admin mixin: ", err)
           
        })
        
};
