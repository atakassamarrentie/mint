'use strict';

module.exports = function (Order) {
    Order.observe('before save', function (ctx, next) {
        if (ctx.hasOwnProperty('currentInstance') && ctx.data.hasOwnProperty('completed') && ctx.data.completed) {
            var Payment = Order.app.models.Payment
            var Product = Order.app.models.Product
            Product.findById(ctx.currentInstance.productId, function (err, res) {
                if (err) next(err)
                if (res && res.hasOwnProperty('id')) {
                    Product.updateAll({ id: res.id }, { inventory: res.inventory + ctx.currentInstance.quantity }, function (err, info) {
                        if (err) next(err)
                    })
                } else {
                    var err = new Error('Product not found');
                    err.statusCode = 400;
                    err.code = 'MIS_PRODUCT';
                    next(err)
                }

            })
            Payment.findById(ctx.currentInstance.paymentId, function (err, res) {
                if (err) next(err)
                Payment.updateAll({ id: res.id }, { balance: res.balance - ctx.currentInstance.total }, function (err, info) {
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
            var Payment = Order.app.models.Payment
            var Product = Order.app.models.Product
            if (res.completed) {
                Payment.findById(res.paymentId, function (err, result) {
                    if (err) next(err)
                    console.log(result.balance)
                    console.log(res.total)
                    Payment.updateAll({ id: result.id }, { balance: (result.balance + res.total) }, function (err, info) {
                        if (err) next(err)
                    })
                })
                Product.findById(res.productId, function (err, result) {
                    if (err) next(err)
                    if (result && result.hasOwnProperty('id')) {
                        Product.updateAll({ id: result.id }, { inventory: (result.inventory - res.quantity) }, function (err, info) {
                            if (err) next(err)
                            next()
                        })
                    } else {
                        var err = new Error('Product not found');
                        err.statusCode = 400;
                        err.code = 'MIS_PRODUCT';
                        next()
                    }
                })
            }
        })
        
    })
};
