const Product = require('../models/product');
const User = require('../models/user');

module.exports.home = async (req, res) => {
    const products = await Product.find({});
    res.render('home', { products });
};

module.exports.index = async (req, res) => {
    let noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const products = await Product.find({ title: regex });
        if (products.length < 1) {
            noMatch = 'No product match that query, please try again.';
        }
        res.render('products/index', { products, noMatch });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, noMatch, title: 'All Products' });
    }
};

module.exports.showProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product, title: product.title });
};

module.exports.showCart = async (req, res) => {
    const user = await User.findById({ _id: req.user._id }).populate({
        path: 'cart.items.productId'
    });
    const products = user.cart.items;
    res.render('products/cart', { products, title: 'Cart' });
};

module.exports.addCart = async (req, res) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const user = await User.findById({ _id: req.user._id })
    await user.addToCart(product);
    res.redirect('/cart');
};

module.exports.removeCart = async (req, res) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const user = await User.findById({ _id: req.user._id }).populate({
        path: 'cart.items.productId'
    });
    await user.removeFromCart(product);
    req.flash('success', 'Product removed from cart!');
    res.redirect('/cart');
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};