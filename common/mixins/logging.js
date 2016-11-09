var loopback = require('loopback');
var LoopBackContext = require('loopback-context');


module.exports = function (Model, options) {
    Model.observe('after save', function (ctx, next) {
        var Logging = Model.app.models.Logging;
        var context = loopback.getCurrentContext();
        var user = context.get('accessToken')
        Logging.create({
            userId: user.userId,
            date: new Date(),
            hook: "save",
            model: Model.definition.name,
            instance: ctx.instance
        })
        next();
    })
    Model.observe('before delete', function (ctx, next) {
        var Logging = Model.app.models.Logging;
        var context = loopback.getCurrentContext();
        var user = context.get('accessToken')

        console.log("ID: ", ctx.where.id)
        Model.findById(ctx.where.id, function (err, res) {
            Logging.create({
                userId: user.userId,
                date: new Date(),
                hook: "delete",
                model: Model.definition.name,
                instance: res
            })
        })
        next();
    })
};
