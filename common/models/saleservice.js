'use strict';

module.exports = function (Saleservice) {
    Saleservice.beforeRemote('create', function (ctx, fc, next) {
        if (ctx.hasOwnProperty('args')) {
            var Payment = Saleservice.app.models.Payment
            var Service = Saleservice.app.models.Service
            var currentInstance = ctx.args.data
            Payment.findById(currentInstance.paymentId, function (err, res) {
                if (err) next(err)
                Payment.updateAll({ id: res.id }, { balance: res.balance + currentInstance.total }, function (err, info) {
                    if (err) next(err)
                })
            })
        }
        next();
    })

    Saleservice.observe('before delete', function (ctx, next) {
        Saleservice.findById(ctx.where.id, function (err, res) {
            if (err) next(err)
            var Payment = Saleservice.app.models.Payment
            var Service = Saleservice.app.models.Service
            Payment.findById(res.paymentId, function (err, result) {
                if (err) next(err)
                Payment.updateAll({ id: result.id }, { balance: (result.balance - res.total) }, function (err, info) {
                    if (err) next(err)
                })
            })
        })
        next()
    })
};
