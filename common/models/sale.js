'use strict';

module.exports = function (Sale) {
    Sale.beforeRemote('create', function (ctx, fc, next) {
        if (ctx.hasOwnProperty('args')) {
            var Payment = Sale.app.models.Payment
            var Product = Sale.app.models.Product
            var currentInstance = ctx.args.data
            Payment.findById(currentInstance.paymentId, function (err, res) {
                if (err) next(err)
                Payment.updateAll({ id: res.id }, { balance: res.balance + currentInstance.total }, function (err, info) {
                    if (err) next(err)
                })
            })
            Product.findById(currentInstance.product.id, function (err, res) {
                if (err) next(err)
                Product.updateAll({ id: res.id }, { inventory: res.inventory - currentInstance.quantity }, function (err, info) {
                    if (err) next(err)
                })
            })
        }
        next();
    })

    Sale.observe('before delete', function (ctx, next) {
        Sale.findById(ctx.where.id, function (err, res) {
            if (err) next(err)
            var Payment = Sale.app.models.Payment
            var Product = Sale.app.models.Product
            Payment.findById(res.paymentId, function (err, result) {
                if (err) next(err)
                Payment.updateAll({ id: result.id }, { balance: (result.balance - res.total) }, function (err, info) {
                    if (err) next(err)
                })
            })
            Product.findById(res.productId, function (err, result) {
                if (err) next(err)
                Product.updateAll({ id: result.id }, { inventory: (result.inventory + res.quantity) }, function (err, info) {
                    if (err) next(err)
                })
            })
        })
        next()
    })
};
