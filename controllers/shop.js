const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      products: products,
      docTitle: 'Products',
      path: '/',
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products: products,
      docTitle: 'Products',
      path: '/products',
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', { docTitle: 'Cart', path: '/cart' });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  });
};
