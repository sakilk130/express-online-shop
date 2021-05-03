const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/orders');
const product = require('../models/product');
const fs = require('fs');
const path = require('path');
const orders = require('../models/orders');
const pdfDocument = require('pdfkit');

const stripe = require('stripe')(
  'sk_test_51In4FpE6DZq2CzOomGbST6OIkA70ZdCz13o3wxQWiIijek9OsrZB4ZDSqCOTfO90V9hiD6euqQMHCpSKH3dZ7OU900ShtXWudy'
);
const pagination_per_page = 3;

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * pagination_per_page)
        .limit(pagination_per_page);
    })
    .then((products) => {
      res.render('shop/index', {
        products: products,
        docTitle: 'Products',
        path: '/',
        currentPage: page,
        hasNextPage: pagination_per_page * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / pagination_per_page),
      });
    })
    .catch((err) => next(err));
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * pagination_per_page)
        .limit(pagination_per_page);
    })
    .then((products) => {
      res.render('shop/product-list', {
        products: products,
        docTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: pagination_per_page * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / pagination_per_page),
      });
    })
    .catch((err) => next(err));
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.productID;
  Product.findById(productID)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        docTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      console.log(products);
      res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart',
        cartProducts: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      let totalSum = 0;
      products.forEach((p) => {
        totalSum += p.quantity * p.productId.price;
      });
      res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout',
        products: products,
        totalSum: totalSum,
      });
    });
};

exports.postOrder = (req, res, next) => {
  const token = req.body.stripeToken;
  let totalSum = 0;

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      user.cart.items.forEach((p) => {
        totalSum += p.quantity * p.productId.price;
      });

      const products = user.cart.items.map((i) => {
        return { products: { ...i.productId._doc }, quantity: i.quantity };
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
      const charge = stripe.charges.create({
        amount: totalSum * 100,
        currency: 'usd',
        description: 'Demo Order',
        source: token,
        metadata: { order_id: result._id.toString() },
      });
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('Order Not found'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const pdfDoc = new pdfDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoicePath + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      });
      pdfDoc.text('---------------------------------');
      let totalPrice = 0;
      // console.log(order.products[0].products.price);
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.products.price;
        pdfDoc
          .fontSize(20)
          .text(
            prod.products.title +
              '-' +
              prod.quantity +
              'x' +
              '$' +
              prod.products.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch((err) => {
      return next(err);
    });
};
