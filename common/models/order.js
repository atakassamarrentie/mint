'use strict';

module.exports = function (Order) {
    Order.observe('before save', function (ctx, next) {
        if (ctx.hasOwnProperty('currentInstance') && ctx.data.hasOwnProperty('completed') && ctx.data.completed) {
            var payment = Order.app.models.Payment
            payment.findById(ctx.currentInstance.paymentId, function (err, res) {
                if (err) next(err)
                payment.updateAll({ id: res.id }, { balance: res.balance - ctx.currentInstance.total }, function (err, info) {
                    if (err) next(err)
                })
            })
        }
        next();
    })

    Order.observe('before delete', function (ctx, next) {
        //
        Order.findById(ctx.where.id, function (err, res) {
            if (err) next(err)
            var payment = Order.app.models.Payment
            if (res.completed) {
                payment.findById(res.paymentId, function (err, result) {
                    if (err) next(err)
                    console.log(result.balance)
                    console.log(res.total)
                    payment.updateAll({ id: result.id }, { balance: (result.balance + res.total) }, function (err, info) {
                        if (err) next(err)
                    })
                })
            }
        })
        next()
    })
};
