'use strict';

module.exports = function (Order) {
    Order.observe('before save', function (ctx, next) {
        

        if (ctx.hasOwnProperty('currentInstance') && ctx.data.hasOwnProperty('completed') && ctx.data.completed) {
            var Payment = Order.app.models.Payment
            var Product = Order.app.models.Product
            var SubOrder = Order.app.models.SubOrder
            var totalPrice = 0

            //-- handle payment balances
            SubOrder.find({ where: { orderId: ctx.currentInstance.id } }, function (err, res) {
                res.forEach(function (subOrder) {
                    totalPrice += subOrder.total
                })
                console.log("Total Price: ", totalPrice)
                Payment.findOne({where: {id: ctx.currentInstance.paymentId}}, function (err2, res2){
                    console.log("Payment:", res2)
                    var newBalance = res2.balance - totalPrice
                    console.log("New Balance: ", newBalance)
                    Payment.updateAll({id: ctx.currentInstance.paymentId}, {balance: newBalance}, function(err3, res3){
                        console.log("RES: ", res3)
                    })
                })
            })

            //-- handle product inventory


        }
        next()
    })
};
