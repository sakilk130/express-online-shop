const { json } = require('body-parser');
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.floor(Math.random() * 1000000000000000).toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(products);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(productId, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === productId);
      callback(product);
    });
  }
};
