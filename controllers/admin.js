const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products: products,
      docTitle: 'Products',
      path: '/admin/products',
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    res.redirect('/');
  }
  Product.findById(productId, (product) => {
    res.render('admin/edit-product', {
      docTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    id,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};
