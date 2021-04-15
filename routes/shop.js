const express = require('express');
const router = express.Router();
const path = require('path');
const adminData = require('./admin');

router.get('/', (req, res) => {
  const products = adminData.products;
  res.render('shop', { products: products, docTitle: 'Products', path: '/' });
});

module.exports = router;
