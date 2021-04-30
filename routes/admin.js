const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
  '/add-product',
  isAuth,
  [
    body('title', 'Please enter valid title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Please enter a valid image URL').isURL(),
    body('price', 'Please enter valid price').isFloat(),
    body('description').isString().isLength({ min: 8, max: 400 }).trim(),
  ],
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  isAuth,
  [
    body('title', 'Please enter valid title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Please enter a valid image URL').isURL(),
    body('price', 'Please enter valid price').isFloat(),
    body('description').isString().isLength({ min: 8, max: 400 }).trim(),
  ],
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
