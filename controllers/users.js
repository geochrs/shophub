const User = require('../models/user');
const Order = require('../models/order');

module.exports.renderAccount = async (req, res) => {
    const users = await User.find({})
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('users/account', { users, orders, title: 'Account' });
};

module.exports.updateAccount = async (req, res) => {
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, req.body.user, { runValidators: true, new: true })
    await user.save();
    req.flash('success', 'Successfully updated account!');
    res.redirect('/account');
};

module.exports.renderRegister = async (req, res) => {
    res.render('users/register', { title: 'Register' });
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome ${user.username}`);
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/account/register')
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login', { title: 'Login' });
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/');
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};