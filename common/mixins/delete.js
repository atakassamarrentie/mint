module.exports = function (Model, options) {
    
    Model.markAsDeleted = function(id, cb){
            Model.update({id: {inq: id}}, {deleted: true}, function(err, info){
                if (err) {return cb(err)}
                console.log(info)
                return cb(null, info)
            });
    }



    Model.undelete = function(id, cb){
        Model.update({id: {inq: id}}, {deleted: false}, cb);
    }
    
    Model.remoteMethod(
       'markAsDeleted', {
           http: {verb: 'get',path: '/:id/markAsDeleted'},
         accepts: {arg: 'id', type: 'array', required: true, description: 'User id'},
         returns: {arg: 'result',type: 'number', root: true}
       }
   );
   
   Model.remoteMethod(
       'undelete', {
         http: {verb: 'get',path: '/:id/undelete'},
         accepts: {arg: 'id', type: 'array', required: true, description: 'User id'},
         returns: {arg: 'count',type: 'number', root: true}
       }
   )


}