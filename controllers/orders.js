const User = require('../models/user');
const Order = require('../models/order');

const PDFDocument = require('pdfkit');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports.showCheckout = async (req, res) => {
    const user = await User.findById({ _id: req.user._id }).populate({
        path: 'cart.items.productId'
    });
    const products = user.cart.items;
    let total = 0;
    products.forEach((p) => {
        total += p.quantity * p.productId.price;
    });
    res.render('products/checkout', { products, totalSum: total, title: 'Checkout' });
};

module.exports.checkout = async (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate({
            path: 'cart.items.productId'
        })
        .then((user) => {
            products = user.cart.items;
            total = 0;
            products.forEach((p) => {
                total += p.quantity * p.productId.price;
            });

            return stripe.checkout.sessions.create({
                line_items: products.map((p) => {
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: p.productId.title
                            },
                            unit_amount: p.productId.price * 100,
                        },
                        quantity: p.quantity,
                    }
                }),
                mode: 'payment',
                success_url:
                    req.protocol + "://" + req.get("host") + "/checkout/success",
                cancel_url: req.protocol + "://" + req.get("host") + "/checkout",
            })
        })
        .then((session) => {
            res.redirect(303, session.url);
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

module.exports.checkoutSuccess = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
                products: products,
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => res.redirect("/account"))
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.renderInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new ExpressError("No Order Found.", 404));
            }

            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new ExpressError("Unauthorized", 404));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const pdf = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            );
            pdf.pipe(fs.createWriteStream(invoiceName));
            pdf.pipe(res);

            pdf
                .fillColor('#094AAC')
                .fontSize(26)
                .text('Invoice', { underline: true });
            pdf.text(' ');

            let totalPrice = 0;
            order.products.forEach((prod) => {
                totalPrice += prod.quantity * prod.product.price;

                pdf
                    .fillColor('black')
                    .fontSize(16)
                    .text(
                        prod.product.title +
                        ' : ' +
                        prod.quantity +
                        ' x ' +
                        prod.product.price +
                        '\u20AC'
                    );
            });
            pdf.text(' ');
            pdf.text('----------------------------------------------');
            pdf.fontSize(20).text(`Total Price: ${totalPrice}${'\u20AC'}`);
            pdf.end();
        })
        .catch((err) => next(err));
};
