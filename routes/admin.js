const express = require('express');
const router = express.Router();
const path = require('path');
const RootDir = require('../utill/path.js');

const products = [];

router.get('/add-product', (req, res) => {
  res.render('add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
  });
});

router.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

exports.router = router;
exports.products = products;
