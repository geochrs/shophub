const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.route('/checkout')
    .get(isLoggedIn, catchAsync(orders.showCheckout))
    .post(isLoggedIn, catchAsync(orders.checkout));

router.get('/checkout/success', isLoggedIn, orders.checkoutSuccess);

router.get('/orders/:orderId', orders.renderInvoice);

module.exports = router;
