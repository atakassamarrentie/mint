
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ordersAndSales.orders')
        .filter('myFilter', function () {
            return function (array, expression) {
                console.log(expression)
                //an example
                return array.filter(function (val, index) {
                    var ord, exp, prn, prc, par, pay, uid, una, sel
                    ord = exp = prn = prc = par = pay = uid = una = sel =  true
                    if (expression.hasOwnProperty('order_date')) {
                        var expDate = new Date(expression.order_date)
                        expDate = expDate.setHours(0, 0, 0, 0)
                        ord = new Date(val.order_date.setHours(0, 0, 0, 0)).getTime() == expDate;
                    } 
                     
                    if (expression.hasOwnProperty('expected_date')) {
                        var expDate = new Date(expression.expected_date)
                        expDate = expDate.setHours(0, 0, 0, 0)
                        exp = new Date(val.expected_date.setHours(0, 0, 0, 0)).getTime() == expDate;
                    } 

                    if (expression.hasOwnProperty('sale_date')) {
                        var selDate = new Date(expression.sale_date)
                        selDate = selDate.setHours(0, 0, 0, 0)
                        sel = new Date(val.sale_date.setHours(0, 0, 0, 0)).getTime() == selDate;
                    } 

                    if (expression.hasOwnProperty('product_name')) {
                        console.log(val)
                        prn = val.product_name.indexOf(expression.product_name) !== -1
                    } 

                     if (expression.hasOwnProperty('product_category')) {
                        prc = val.product_category == expression.product_category
                    } 

                    if (expression.hasOwnProperty('partner')) {
                        par = val.partner.name == expression.partner.name
                    }
                    //console.log(ord , '&', exp, '&', exp, '=', ord & exp)
                    if (expression.hasOwnProperty('payment')) {
                        pay = val.payment.name == expression.payment.name
                    }

                    if (expression.hasOwnProperty('userId')) {
                        console.log(val)
                        uid = val.userId == expression.userId
                    }

                    if (expression.hasOwnProperty('username')) {
                        una = val.username.indexOf(expression.username) !== -1
                    }

                    return ord & exp & prn & prc & par & pay & uid & una & sel
                });
            }
        })
})();