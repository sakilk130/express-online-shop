const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (req, res, next) => {
  const productID = req.params.productID;
  Product.findById(productID, (product) => {
    res.render('shop/product-details', {
      product: product,
      docTitle: 'Product',
      path: '/products',
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const cartProduct = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProduct) {
          cartProducts.push({
            productData: product,
            productQty: cartProduct.qty,
          });
        }
      }
      // res.send(cartProducts);
      res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart',
        cartProducts: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  });
};
