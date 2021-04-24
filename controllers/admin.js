const Product = require('../models/product');
const mongodb = require('mongodb');

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
  product
    .save()
    .then((results) => {
      // console.log(results);
      console.log('Product Created !!!');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        products: products,
        docTitle: 'Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    res.redirect('/');
  }
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const product = new Product(
    new mongodb.ObjectId(id),
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  );
  product
    .save()
    .then((result) => {
      console.log('Product Updated !!!');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.productId;
//   Product.findOne({ where: { id: productId } })
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((results) => {
//       console.log('product deleted !!!');
//       res.redirect('/admin/products');
//     })
//     .catch((err) => console.log(err));
// };
