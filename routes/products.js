const express = require('express');
const router = express.Router();
const products = require('../controllers/products');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware')

router.get('/', catchAsync(products.home));

router.route('/products')
    .get(catchAsync(products.index));

router.route('/products/:id')
    .get(catchAsync(products.showProduct));

router.route('/cart')
    .get(isLoggedIn, catchAsync(products.showCart))
    .post(isLoggedIn, catchAsync(products.addCart));

router.post('/cart-delete-item', isLoggedIn, catchAsync(products.removeCart));

module.exports = router;


