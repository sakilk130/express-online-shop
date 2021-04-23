const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        products: products,
        docTitle: 'Products',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products: products,
        docTitle: 'Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.productID;
  Product.findOne({ where: { id: productID } })
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
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render('shop/cart', {
            docTitle: 'Cart',
            path: '/cart',
            cartProducts: products,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
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
